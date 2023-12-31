const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "bardv2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aki Hayakawa",
  description: "BardAPI with Image recognition!",
  usePrefix: true,
  commandCategory: "tools",
  usages: "",
  cooldowns: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    let prompt = args.join(" ");
    let credits = this.config.credits;
    let imageUrl;

    if (event && event.type === "message_reply" && event.messageReply && !event.messageReply.attachments) {
      // If it's a message_reply and there are no attachments, use the body as prompt
      prompt = event.messageReply.body;
    } else if (!prompt) {
      // If there's no prompt and no message_reply, return a default message
      const message = "Hello, I'm Bard created by Aki. How can I help you?";
      return api.sendMessage(message, event.threadID, event.messageID);
    }

    if (event && event.type === "message_reply" && event.messageReply && event.messageReply.attachments) {
      const attachment = event.messageReply.attachments[0];
      if (attachment.type === "photo" || attachment.type === "audio") {
        imageUrl = attachment.url;
      }
    }

    api.sendMessage("Generating response ✅", event.threadID, event.messageID);

    const res = await axios.post("https://bardv2.yootyub.repl.co/", {
      message: prompt,
      credits: credits,
      image_url: imageUrl,
    });

    let response = res.data.message;
    response = response
      .replace(/\n\[Image of .*?\]|(\*\*)/g, "")
      .replace(/^\*/gm, "•");

    const imageUrls = res.data.imageUrls;
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const attachments = [];

      if (!fs.existsSync("cache")) {
        fs.mkdirSync("cache");
      }

      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        const imagePath = `cache/image${i + 1}.png`;

        try {
          const imageResponse = await axios.get(url, {
            responseType: "arraybuffer",
          });
          fs.writeFileSync(imagePath, imageResponse.data);
          attachments.push(fs.createReadStream(imagePath));
        } catch (error) {
          console.error(
            "Error occurred while downloading and saving the image:",
            error
          );
        }
      }

      api.sendMessage(
        {
          attachment: attachments,
          body: response,
        },
        event.threadID,
        event.messageID
      );
    } else {
      api.sendMessage(response, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage(`Error: ${error}`, event.threadID, event.messageID);
    api.setMessageReaction("👎", event.messageID, () => {}, true);
  }
};
