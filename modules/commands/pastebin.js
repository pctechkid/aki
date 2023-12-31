module.exports.config = {
    name: "pastebin",
    version: "1.0",
    hasPermssion: 0,
    credits: "Aki Hayakawa",
    description: "",
    usePrefix: true,
    commandCategory: "tool",
    usages: "",
    cooldowns: 0,
};
module.exports.run = async function({
    api,
    event,
    args
}) {
    const {
        threadID,
        messageID
    } = event;
    const {
        PasteClient
    } = require('pastebin-api');
    const client = new PasteClient("aeGtA7rxefvTnR3AKmYwG-jxMo598whT");
    var text = args.join(" ");
    if (event.type == "message_reply") {
        text = event.messageReply.body;
    }
    if (!text) {
        return api.sendMessage('Input text or reply to a message you wish to upload to pastebin', threadID, messageID);
    }
    // Create a paste with the updated data
    const url = await client.createPaste({
        code: text,
        expireDate: 'N',
        name: 'temp',
        publicity: 1
    });
    const id = url.split('/')[3];
    const link = 'https://pastebin.com/raw/' + id;
    return api.sendMessage(link, threadID);
}