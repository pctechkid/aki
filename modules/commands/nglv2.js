module.exports.config = {
  name: "nglv2",
  version: "1.0.",
  hasPermission: 0,
  credits: "Aki Hayakawa",
  usePrefix: true,
  description: "Spam NGL messages",
  commandCategory: "Spam",
  cooldowns: 2,
};

const axios = require('axios');

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args.length < 3) {
      api.sendMessage(`Insufficient arguments.\nUsage: ${global.config.PREFIX}ngl [username] [message] [amount]`, event.threadID);
      return;
    }

    const username = args.shift();
    const message = args.slice(0, -1).join(" "); 
    const spamCount = parseInt(args[args.length - 1]); 

    if (isNaN(spamCount) || spamCount <= 0) {
      api.sendMessage('Invalid amount. Please provide a valid positive number.', event.threadID);
      return;
    }

    console.log(`Spamming To : ${username}`);
    for (let i = 0; i < spamCount; i++) {
      const response = await axios.post('https://ngl.link/api/submit', {
        username: username,
        question: message,
        deviceId: '23d7346e-7d22-4256-80f3-dd4ce3fd8878',
        gameSlug: '',
        referrer: '',
      });
      console.log(`Message ${i + 1}: Status - ${response.status}`);
    }
    api.sendMessage(`Successfully sent ${spamCount} times to ${username}`, event.threadID);
} catch (error) {
    api.sendMessage('Something went wrong', event.threadID, event.messageID);
  }
};

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});