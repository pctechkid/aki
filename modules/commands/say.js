const axios = require("axios");
const fs = require("fs");
const { createReadStream, unlinkSync } = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "say",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Aki Hayakawa",
  description: "Text to speech",
  usePrefix: true,
  commandCategory: "Song/video",
  usages: "say [Text] or reply",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
  },
};

module.exports.run = async function ({ api, event, args }) {
  
  const msg = args.join(" ");
  const file = path.join(__dirname, "/cache", `say_${event.senderID}.mp3`);

  if(event.type == "message_reply") {
      const getFile = (await axios.get(`https://translate.google.com/translate_tts?ie=UTF-8&q=${event.messageReply.body}&tl=tl&client=tw-ob`, { responseType: 'arraybuffer'})).data;
      fs.writeFileSync(file, Buffer.from(getFile, 'utf-8'));
      api.sendMessage({body: event.messageReply.body, attachment: fs.createReadStream(file)}, event.threadID, (err) => {
        fs.unlinkSync(file);
        if (err) return api.sendMessage(`Server error`, event.threadID, event.messageID);
        }, event.messageID);
  }
  else {
    try {
      if (!msg) {
        const errorMessage = `Missing text. How to use?\n${global.config.PREFIX}say <text>\n\nExample:\n${global.config.PREFIX}say hello aki`;
        return api.sendMessage({ body: errorMessage }, event.threadID, event.messageID);
      } else {
        const getFile = (await axios.get(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=tl&client=tw-ob`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(file, Buffer.from(getFile, 'utf-8'));
        api.sendMessage({ body: msg, attachment: createReadStream(file) }, event.threadID, () => unlinkSync(file), event.messageID);
      }
    } catch (error) {
      console.error(error);
    }
  }
};
