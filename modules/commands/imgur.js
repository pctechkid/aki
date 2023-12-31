module.exports.config = {
  name: "imgur",
  version: "30.0.10",
  hasPermssion: 0,
  credits: "Aki Hayakawa",
  description: "imgur upload",
  usePrefix: true,
  commandCategory: "imgur",
  usages: "[reply to image]",
  cooldowns: 0,
};

module.exports.run = async function ({ api, event }) {
	try {
		const axios = require('axios');
		let image_url;
		if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
			image_url = event.messageReply.attachments[0].url;
		} else if (event.attachments.length > 0) {
			image_url = event.attachments[0].url;
		} else {
			return api.sendMessage('No attachment detected. Please reply to an image.', event.threadID, event.messageID);
		}
		const imgurClientId = '02f41afcfe1fe8f';
		const imgurUpload = await axios.post('https://api.imgur.com/3/image', {
			image: image_url,
		}, {
			headers: {
				Authorization: `Client-ID ${imgurClientId}`,
			}
		});
		const imgurLink = imgurUpload.data.data.link;
		return api.sendMessage(imgurLink, event.threadID, event.messageID);
	} catch (error) {
		console.log(error);
		return api.sendMessage(`Failed to upload image to Imgur`, event.threadID, event.messageID);
	}
}