module.exports.config = {
    name: "uid",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Aki Hayakawa",
    description: "Get User ID.",
    usePrefix: true,
    commandCategory: "other",
    cooldowns: 5
};

const axios = require('axios');

module.exports.run = async ({
    api,
    event,
    args,
    Users
}) => {
    let {
        threadID,
        senderID,
        messageID
    } = event;
    if (!args[0]) {
        var uid = senderID;
    }
    if (event.type == "message_reply") {
        uid = event.messageReply.senderID;
		return api.sendMessage(uid, threadID, messageID);
    }
    if (args.join(" ").indexOf('@') !== -1) {
        uid = Object.keys(event.mentions)[0]
		return api.sendMessage(uid, threadID, messageID);
    }
	if (args.join(" ").startsWith("https://www.facebook.com/")){
		const fburl = await axios.get(`https://nguyen-chard-api.joshuag06.repl.co/api/tools/fuid?link=${encodeURIComponent(args.join(" "))}`);
		uid = fburl.data.result;
		return api.sendMessage({ body: `${uid}`}, threadID, messageID);
	}
	return api.sendMessage(uid, threadID, messageID);
}