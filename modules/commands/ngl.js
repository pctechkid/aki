module.exports.config = {
  name: "ngl",
  version: "1.0.",
  hasPermission: 0,
  credits: "Aki Hayakawa",
  usePrefix: true,
  description: "Spam NGL messages",
  commandCategory: "Spam",
  cooldowns: 2,
};

module.exports.run = async function({
  api,
  event,
  args
}) {
  const axios = require('axios');
  const username = args.shift();
  const message = args.slice(0, -1).join(" "); 
  const spamCount = parseInt(args[args.length - 1]); 

  if (!args[0]){
    return api.sendMessage(`Usage:\n${global.config.PREFIX}ngl [username] [message] [count]`, event.threadID);
  }

  if (isNaN(spamCount) || spamCount <= 0) {
    api.sendMessage('Invalid input. Please provide a valid number.', event.threadID);
    return;
  }

  try {
    const link = await axios.get(`https://nguyen-chard-api.joshuag06.repl.co/api/other/nglspam?username=${username}&message=${message}&total=${spamCount}`);
    const result = link.data.result;
    return api.sendMessage({
      body: result.replace(/Success Sending Messages NGL To/, "Status: Success")
                  .replace(/UserName :/g, '\nUsername:')
                  .replace(/\| Messages :/g, '\nMessage:')
                  .replace(/\| Total :/g, '\nSent:')
    }, event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage({
      body: 'Failed. Something went wrong'
    }, event.threadID, event.messageID);
  }
}