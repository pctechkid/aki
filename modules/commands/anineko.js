module.exports.config = {
	name: "anineko",
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
		const get = (await axios.get(`https://asuna.ga/api/neko/`)).data;
		const link = get.url;
		const download = await axios.get(link, {
			responseType: 'arraybuffer'
		});
		const nekoPath = path.join(__dirname, 'cache', `neko.png`);
		fs.writeFileSync(nekoPath, Buffer.from(download.data, 'utf-8'));
		return api.sendMessage({
			attachment: fs.createReadStream(nekoPath)
		}, event.threadID, () => fs.unlinkSync(nekoPath), event.messageID);
	} catch (error){
		console.log(error);
		return api.sendMessage('Failed', event.threadID, event.messageID);
	}
}