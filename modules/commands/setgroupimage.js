const fs = require("fs");
const axios = require("axios")
module.exports.config = {
	name: "setgroupimage",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "Aki Hayakawa",
	description: "Change your group image",
	usePrefix: true,
  commandCategory: "Box", 
	usages: "groupimage", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async ({ api, event }) => {
	if (event.type !== "message_reply") return api.sendMessage("You need to reply to the image you wish to set as the group photo", event.threadID, event.messageID);
	if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("You need to respond to the image you wish to set as the group photo", event.threadID, event.messageID);
	if (event.messageReply.attachments.length > 1) return api.sendMessage(`Please reply only 1 image`, event.threadID, event.messageID);
	var abc = event.messageReply.attachments[0].url
	let pathImg = __dirname + '/cache/loz.png';
    let getdata = (await axios.get(`${abc}`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(pathImg, Buffer.from(getdata, 'utf-8'));
    return api.changeGroupImage(fs.createReadStream(__dirname + '/cache/loz.png'), event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
  }