module.exports.config = {
	name: "aniavatar",
	version: "1.0",
	hasPermssion: 0,
	credits: "Aki Hayakawa",
	description: "",
	usePrefix: true,
	commandCategory: "anime",
	usages: "",
	cooldowns: 0,
};

const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.run = async function({ api, args, event }) {

	try {
		const get = await axios.get(`https://api.zahwazein.xyz/api/anime/sfw/avatar?apikey=zenzkey_1ec92f71d3bb`, {
			responseType: 'arraybuffer'
		});
		const avatarPAth = path.join(__dirname, 'cache', `aniavatar.png`);
		fs.writeFileSync(avatarPAth, Buffer.from(get.data, 'utf-8'));
		return api.sendMessage({
			attachment: fs.createReadStream(avatarPAth)
		}, event.threadID, () => fs.unlinkSync(avatarPAth), event.messageID);
	} catch (error){
		console.log(error);
		return api.sendMessage('Failed', event.threadID, event.messageID);
	}
}