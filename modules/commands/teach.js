const axios = require("axios");

module.exports.config = {
  name: "teach",
  version: "1",
  hasPermssion: 0,
  credits: "Aki Hayakawa",
  description: "Teach Simsimi",
  usePrefix: true,
  usages: "Teach",
  commandCategory: "...",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const text = args.join(" ");
    const text1 = text.substr(0, text.indexOf(' - '));
    const text2 = text.split(" - ").pop();

    if (!text1 || !text2) {
      return api.sendMessage(`Usage:\n${global.config.PREFIX}teach hi - hello`, event.threadID, event.messageID);
    }

    // const response = await axios.get(`https://nguyen-chard-api.joshuag06.repl.co/api/sim/simv3?type=teach&ask=${encodeURIComponent(text1)}&ans=${encodeURIComponent(text2)}`);
    const response = await axios.get(`https://simsimi.fun/api/v2/?mode=teach&lang=ph&message=${encodeURIComponent(text1)}&answer=${encodeURIComponent(text2)}`);
    api.sendMessage(`Thank you for teaching me!\n\nMessage:\n${text1}\n\nResponse:\n${text2}`, event.threadID, event.messageID);
  } catch (error) {
    console.error("An error occurred:", error);
    api.sendMessage("Oops! Something went wrong.", event.threadID, event.messageID);
  }
};