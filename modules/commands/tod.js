const axios = require('axios');

const BASE_API_URL = "https://sensui-useless-apis.codersensui.repl.co";

module.exports.config = {
  name: "tod",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Aki Hayakawa",
  description: "Get a random Truth or Dare",
  usePrefix: true,
  commandCategory: "Fun",
  usages: ["tod truth", "tod dare"],
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    function getFirstName(fullName) {
      let names = fullName.split(' ');
      return names[0] || fullName;
    }
    const subcommand = args[0]?.toLowerCase();

    if (subcommand === "truth" || subcommand === "dare") {
      const prompt = await getRandomPrompt(subcommand);

      //added
      const senderInfo = await api.getUserInfo(event.senderID);
      const senderName1 = senderInfo[event.senderID].name;
      let senderName = getFirstName(senderName1);

      const message = `${senderName}, here's your random ${subcommand}:\n\n${prompt}`;
      api.sendMessage({ 
        body: message,
        mentions: [{
          tag: senderName,
          id: event.senderID
      }]
      }, event.threadID);
    } else {
      api.sendMessage(`Invalid subcommand.\nUsage: ${global.config.PREFIX}tod truth or ${global.config.PREFIX}tod dare`, event.threadID);
    }
  } catch (error) {
    console.error("Error fetching prompt:", error);
    api.sendMessage("An error occurred while fetching the prompt.", event.threadID);
  }
};

async function getRandomPrompt(type) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/fun/${type}`);
    return response.data.question;
  } catch (error) {
    console.error(`Error fetching ${type} prompt from the API:`, error);
    throw new Error(`Failed to fetch ${type} prompt from the API.`);
  }
}
