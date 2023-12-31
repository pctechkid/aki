module.exports.config = {
	name: "aniwaifu",
	version: "1.0",
	hasPermssion: 0,
	credits: "Aki Hayakawa",
	description: "",
	usePrefix: true,
	commandCategory: "anime",
	usages: "",
	cooldowns: 0,
};

const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports.run = async ({ api, event }) => {
	try {
		const waifuPath = path.join(__dirname, "/cache", `waifu.png`);
		const download = await axios.get(`https://weeb-api.vercel.app/waifu`, {
			responseType: 'arraybuffer'
		});
		fs.writeFileSync(waifuPath, Buffer.from(download.data, 'utf-8'));
		return api.sendMessage({
            attachment: fs.createReadStream(waifuPath)
        }, event.threadID, () => fs.unlinkSync(waifuPath), event.messageID);
	} catch (error) {
		console.log(error);
		return api.sendMessage("Failed to fetch waifu", event.threadID, event.messageID);
	}
}