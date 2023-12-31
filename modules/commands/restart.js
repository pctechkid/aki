module.exports.config = {
  name: "restart",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Aki Hayakawa",
  description: "Restart Bot",
  usePrefix: true,
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  return api.sendMessage(`Restarting bot ✅`, threadID, () => process.exit(1));
}