const fs = require('fs-extra');
const pathFile = __dirname + '/cache/deku.txt';
if (!fs.existsSync(pathFile))
  fs.writeFileSync(pathFile, 'false');
module.exports.config = {
	name: "echo",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "Aki Hayakawa",
	description: "Enable/disable echo",
	usePrefix: true,
  commandCategory: "...",
	usages: "on/off",
	cooldowns: 0
};

module.exports.handleEvent = async ({ api, event, args }) => {
  const isEnable = fs.readFileSync(pathFile, 'utf-8');
  if (isEnable == 'true'){
    api.sendMessage(event.body, event.threadID);
if (event.attachments[0].type == "sticker") api.sendMessage({sticker: event.attachments[0].stickerID}, event.threadID);
}
};

module.exports. run = async ({ api, event, args }) => {
  try {
	if (args[0] == 'on') {
	  fs.writeFileSync(pathFile, 'true');
	  api.sendMessage('Echo on successfully', event.threadID, event.messageID);
	}
	else if (args[0] == 'off') {
	  fs.writeFileSync(pathFile, 'false');
	  api.sendMessage('Echo off successfully', event.threadID, event.messageID);
	}
	else {
	  api.sendMessage('wrong format use echo off/on', event.threadID, event.messageID);
	}
  }
  catch(e) {
    console.log(e);
  }
};