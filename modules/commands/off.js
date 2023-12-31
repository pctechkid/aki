module.exports.config = {
    name: "off",
    version: "3.9.0",
    hasPermssion: 2,
    credits: "Aki Hayakawa",
    description: "Turn off bot",
    usePrefix: true,
    commandCategory: "system",
    cooldowns: 0
};
module.exports.run = ({
    event,
    api
}) => api.sendMessage("The bot is now shutting down ✅", event.threadID, () => process.exit(0))