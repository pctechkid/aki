module.exports.config = {
    name: "sendnoti",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Aki Hayakawa",
    description: "Sends an admin message to all groups",
    usePrefix: true,
    commandCategory: "system",
    usages: "[Text]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const threadList = await api.getThreadList(25, null, ['INBOX']);
    let sentCount = 0;
    const custom = args.join(' ');

    async function sendMessage(thread) {
        try {
            await api.sendMessage(`${custom}`, thread.threadID);
            sentCount++;
        } catch (error) {
            console.error("Error sending a message: ", error);
        }
    }

    for (const thread of threadList) {
        if (sentCount >= 20) {
            break;
        }
        if (thread.isGroup && thread.name != thread.threadID && thread.threadID != event.threadID) {
            await sendMessage(thread);
        }
    }

    if (sentCount > 0) {
        api.sendMessage(`Sent the notification successfully.`, event.threadID);
    } else {
        api.sendMessage("No eligible group threads found to send the message to.", event.threadID);
    }
};