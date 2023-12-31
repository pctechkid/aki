module.exports.config = {
    name: "setgroupname",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Aki Hayakawa",
    description: "Rename your group",
    usePrefix: true,
    commandCategory: "Box",
    usages: "setgroupname [name]",
    cooldowns: 0,
    dependencies: []
};

module.exports.run = async function ({ api, event, args }) {
    var name = args.join(" ");
    if (!name) {
        // If no name is provided, set the group name to default
        api.setTitle("", event.threadID, () => api.sendMessage(`Cleared the group name successfully ✅`, event.threadID, event.messageID));
    } else {
        api.setTitle(name, event.threadID, () => api.sendMessage(`Set the group name to ${name} ✅`, event.threadID, event.messageID));
    }
}
