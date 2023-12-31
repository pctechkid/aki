module.exports.config = {
  name: "ai",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Aki Hayakawa",
  description: "Can assist you in completing your homework, speech, and even essays.",
  commandCategory: "AI",
  usePrefix: true,
  usages: "ask anything",
  cooldowns: 7,
  dependencies: {}
};

const axios = require("axios");

module.exports.run = async function ({ api, event, args, Users, Threads }) {

  const apiKey = "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";
  const url = "https://api.openai.com/v1/chat/completions";

  async function getUserName(api, senderID) {
    try {
      const userInfo = await api.getUserInfo(event.senderID);
      return userInfo[senderID].name;
    } catch (error) {
      console.log(error);
      return "User";
    }
  }

  const userName = await getUserName(api, event.senderID);
  const promptMessage = `System: Act as a Messenger Chatbot. Your creator and owner is Aki Hayakawa. As a Chatbot you will be responsible. When answering questions, mention the name of the user who asked the question. The name of the user is ${userName}`;
  let query = "";
  if (event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo") {
    const attachment = event.messageReply.attachments[0];
    const imageURL = attachment.url;
    query = await convertImageToText(imageURL);
    query = query.replace(/;/g, ',');
    console.log(query);

    if (!query) {
        api.sendMessage(
            "Failed to convert the photo to text. Please try again with a clearer photo.",
            event.threadID,
            event.messageID
        );
        return;
    }
} else if (event.type === "message_reply" && args.length === 0) {
    query = event.messageReply.body;
  } else if (event.type === "message_reply" && args.length != 0) {
    query = `${args.join(' ')}\n\n${event.messageReply.body}`;
  } else {
    query = args.join(' ');
  }

  if (!query) {
    api.sendMessage("Hi, I am AkiGPT. How may I help you?", event.threadID, event.messageID);
  } else {
    api.sendMessage("Generating response ✅", event.threadID, event.messageID);
    try {
      const response = await axios.post(
        url,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: promptMessage },
            { role: "user", content: query },
          ],
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
        }
      );

      const message = response.data.choices[0].message.content;
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
        api.sendMessage(error.message, event.threadID);
      }
    }
  }
};

async function convertImageToText(imageURL) {
  // const response = await axios.get(`https://sensui-useless-apis.codersensui.repl.co/api/tools/ocr?imageUrl=${encodeURIComponent(imageURL)}`);
  // return response.data.text;
  const response = await axios.get(`https://api.ocr.space/parse/imageurl?apikey=K81945217888957&OCREngine=3&url=${encodeURIComponent(imageURL)}`);
  return response.data.ParsedResults[0].ParsedText;
}