module.exports.config = {
	name: 'ship',
	version: '1.0',
	hasPermssion: 0,
	credits: 'Aki Hayakawa',
	description: '',
	usePrefix: true,
	commandCategory: 'fun',
	usages: '',
	cooldowns: 0,
};

module.exports.run = async function ({ event, args, api }) {
	try {
		const axios = require('axios');
		const path = require('path');
		const fs = require('fs');
		const request = require('request');

		const lang = 'ceb';
		const imgurClientId = '02f41afcfe1fe8f';

		var id0, id1, name0, name1;

		function getFirstName(fullName) {
			let names = fullName.split(' ');
			return names[0] || fullName;
		}

		try {
			if (args[0] && args[1] && event.mentions) {
				id0 = Object.keys(event.mentions)[0];
				name0 = await api.getUserInfo(id0);
				var name0Full = await name0[id0].name;
				var name0FirstName = getFirstName(name0Full);
				id1 = Object.keys(event.mentions)[1];
				name1 = await api.getUserInfo(id1);
				var name1Full = await name1[id1].name;
				var name1FirstName = getFirstName(name1Full);

				var arraytag = [];
				arraytag.push({ id: id0, tag: name0FirstName });
				arraytag.push({ id: id1, tag: name1FirstName });
			} else {
				return api.sendMessage(`You have to tag 2 persons you want to ship`, event.threadID, event.messageID);
			}
		} catch (error) {
			return api.sendMessage(`You have to tag 1 more person`, event.threadID, event.messageID);
		}

		const avt1 = `https://graph.facebook.com/${id0}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
		const avt2 = `https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

		const imgurUpload1 = await axios.post('https://api.imgur.com/3/image', {
			image: avt1,
		}, {
			headers: {
				Authorization: `Client-ID ${imgurClientId}`,
			}
		});

		// Upload avt2 image to Imgur
		const imgurUpload2 = await axios.post('https://api.imgur.com/3/image', {
			image: avt2,
		}, {
			headers: {
				Authorization: `Client-ID ${imgurClientId}`,
			}
		});

		// Get Imgur direct links for avt1 and avt2 images
		const imgurLink1 = imgurUpload1.data.data.link;
		const imgurLink2 = imgurUpload2.data.data.link;

		const url = `https://api.popcat.xyz/ship?user1=${imgurLink1}&user2=${imgurLink2}`;
		const downloadShip = await axios.get(url, {
			responseType: 'arraybuffer'
		});
		const shipPath = path.join(__dirname, 'cache', `ship.png`);
		fs.writeFileSync(shipPath, Buffer.from(downloadShip.data, 'utf-8'));

		function generateRandomPercentage() {
			const randomDecimal = Math.random();
			const randomPercentage = randomDecimal * 100;
			return Math.ceil(randomPercentage);
		}

		const randomPercentage = generateRandomPercentage();

		const url2 = (await axios.get(`https://api.popcat.xyz/pickuplines`)).data;
		const pickupline = url2.pickupline;
		request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${pickupline}`), (err, response, body) => {
			if (err)
				return api.sendMessage("Shipping the couple failed", event.threadID, event.messageID);

			const retrieve = JSON.parse(body);
			let text = '';
			retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
			return api.sendMessage({
				body: `"${text}"\n\n${name0FirstName} and ${name1FirstName}'s success rate: ${randomPercentage}%`,
				attachment: fs.createReadStream(shipPath),
				mentions: arraytag
			}, event.threadID, () => fs.unlinkSync(shipPath), event.messageID);
		})
	} catch (error) {
		console.log(error);
		return api.sendMessage('Shipping the couple failed', event.threadID, event.messageID);
	}
}