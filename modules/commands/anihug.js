module.exports.config = {
	name: "anihug",
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
		// const get = (await axios.get(`https://asuna.ga/api/hug/`)).data;
		// const link = get.url;
		const download = await axios.get(`https://api.zahwazein.xyz/api/anime/sfw/hug?apikey=zenzkey_1ec92f71d3bb`, {
			responseType: 'arraybuffer'
		});
		const hugPath = path.join(__dirname, 'cache', `hug.gif`);
		fs.writeFileSync(hugPath, Buffer.from(download.data, 'utf-8'));

		if (args.join().indexOf('@') !== -1) {
			function getFirstName(fullName) {
				let names = fullName.split(' ');
				return names[0] || fullName;
			}
			let data1 = await api.getUserInfo(event.senderID);
			let name1Data = await data1[event.senderID].name;
			let firstName1 = getFirstName(name1Data);
		
			let id = Object.keys(event.mentions)[0];
			let data2 = await api.getUserInfo(id);
			let name2Data = await data2[id].name;
			let firstName2 = getFirstName(name2Data);
		
			var arraytag = [];
			arraytag.push({id: event.senderID, tag: firstName1});
			arraytag.push({id: id, tag: firstName2});
		
			api.sendMessage({
				body: `${firstName1} hugged ${firstName2}`,
				attachment: fs.createReadStream(hugPath),
				mentions: arraytag
			}, event.threadID, () => fs.unlinkSync(hugPath), event.messageID);
		} else {
			return api.sendMessage({
				attachment: fs.createReadStream(hugPath)
			}, event.threadID, () => fs.unlinkSync(hugPath), event.messageID);
		}
	} catch (error){
		console.log(error);
		return api.sendMessage('Failed', event.threadID, event.messageID);
	}
}