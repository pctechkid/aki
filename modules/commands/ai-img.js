module.exports.config = {
	name: 'ai-img',
	version: '1.0',
	hasPermssion: 0,
	credits: 'Aki Hayakawa',
	description: '',
	usePrefix: true,
	commandCategory: 'image',
	usages: '',
	cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
	const axios = require('axios');
	const path = require('path');
	const fs = require('fs');
	try {
		let query = args.join(' ');
		if (event.type == 'message_reply') {
			query = event.messageReply.body;
		}
		if (!query) {
			return api.sendMessage(`Please describe the image you want to generate`, event.threadID, event.messageID);
		}
		api.sendMessage("Generating image. Please wait ✅", event.threadID, event.messageID);
		var link = (await axios.get(`https://text2img.bo090909.repl.co/?prompt=${encodeURIComponent(query)}`)).data;

		// Inside the for loop where you're creating attachments
		const arrayAttachment = [];
		for (let index = 0; index <= 2; index++) {
			var responselink = link.imageURLs[index];
			var download = await axios.get(responselink, {
				responseType: 'arraybuffer'
			});

			// Save the image to a file
			const genimgPath = path.join(__dirname, 'cache', 'ai-img', `ai-image${index}.png`);
			fs.writeFileSync(genimgPath, download.data);

			// Push the saved image path to arrayAttachment
			arrayAttachment.push(fs.createReadStream(genimgPath));
		}
		return api.sendMessage({
			attachment: arrayAttachment
		}, event.threadID, () => {
			const folderPath = path.join(__dirname, 'cache', 'ai-img');
			fs.readdir(folderPath, (err, files) => {
				if (err) {
					console.error('Error reading folder:', err);
					return;
				}
				files.forEach((file) => {
					const filePath = `${folderPath}/${file}`;

					fs.unlink(filePath, () => {});
				});
			});
		}, event.messageID);
	} catch (error) {
		console.log(error);
		return api.sendMessage(`Server is offline. Please try again later`, event.threadID, event.messageID);
	}
}


// module.exports.config = {
// 	name: 'ai-img',
// 	version: '1.0',
// 	hasPermssion: 0,
// 	credits: 'Aki Hayakawa',
// 	description: '',
// 	usePrefix: true,
// 	commandCategory: 'image',
// 	usages: '',
// 	cooldowns: 5,
// };

// module.exports.run = async function ({ api, event, args }) {
// 	const axios = require('axios');
// 	const path = require('path');
// 	const fs = require('fs');
// 	try {
// 		const apikey = 'IchanZX';
// 		let query = args.join(' ');
// 		if (event.type == 'message_reply') {
// 			query = event.messageReply.body;
// 		}
// 		if (!query) {
// 			return api.sendMessage(`Please describe the image you want to generate`, event.threadID, event.messageID);
// 		}
// 		api.sendMessage("Generating image. Please wait ✅", event.threadID, event.messageID);
// 		const download = await axios.get(`https://api.lolhuman.xyz/api/dall-e?apikey=${apikey}&text=${encodeURIComponent(query)}`, {
// 			responseType: 'arraybuffer'
// 		});
// 		const imagePath = path.join(__dirname, 'cache', `image_${event.senderID}.png`);
// 		fs.writeFileSync(imagePath, Buffer.from(download.data, 'utf-8'));
// 		return api.sendMessage({
// 			attachment: fs.createReadStream(imagePath)
// 		}, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
// 	} catch (error) {
// 		console.log(error);
// 		return api.sendMessage(`Server is offline. Please try again later`, event.threadID, event.messageID);
// 	}
// }