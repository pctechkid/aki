module.exports.config = {
  name: "ocr",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Aki Hayakawa",
  description: "Extract text from an image",
  commandCategory: "tools",
  usePrefix: true,
  usages: "reply to an image",
  cooldowns: 5,
};

const axios = require("axios");

module.exports.run = async function ({ api, event, args }) {
  let text = "";
  if (
    event.type === "message_reply" &&
    event.messageReply.attachments[0]?.type === "photo"
  ) {
    const attachment = event.messageReply.attachments[0];
    const imageURL = attachment.url;
    text = await convertImageToText(imageURL);
    text = text.replace(/;/g, ",");
    return api.sendMessage(text, event.threadID, event.messageID);

    if (!text) {
      api.sendMessage(
        "Failed to convert the photo to text. Please try again with a clearer photo.",
        event.threadID,
        event.messageID
      );
      return;
    }
  }
};
async function convertImageToText(imageURL) {
  const response = await axios.get(
    `https://api.ocr.space/parse/imageurl?apikey=K81945217888957&OCREngine=3&url=${encodeURIComponent(
      imageURL
    )}`
  );
  return response.data.ParsedResults[0].ParsedText;
}
