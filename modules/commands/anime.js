module.exports.config = {
	name: 'anime',
	version: '1.0',
	hasPermssion: 0,
	credits: 'Aki Hayakawa',
	description: 'Fetch anime details',
	usePrefix: true,
	commandCategory: 'anime',
	usages: '',
	cooldowns: 0,
};

module.exports.run = async function ({ api, event, args }) {
	try {
		const axios = require('axios');
		const fs = require('fs');
		const path = require('path');
		let search = '';
		if (event.type === 'message_reply') {
			search = event.messageReply.body;
		} else {
			search = args.join(' ');
		}
		if (!search) {
			return api.sendMessage(`Anime title is missing`, event.threadID, event.messageID);
		}
		api.sendMessage(`Searching anime. Please wait ✅`, event.threadID, event.messageID);
		const result = (await axios.get(`https://api-ronnel.vercel.app/anime?search=${encodeURIComponent(search)}`)).data;
		const title = result.title;
		const title_english = result.title_english;
		const type = result.type;
		const episodes = result.episodes;
		const status = result.status;
		const aired = result.aired;
		const premiered = result.premiered;
		const broadcast = result.broadcast;
		const studio = result.studio;
		const genres = result.genres;
		const theme = result.theme;
		const rating = result.rating;
		const image = result.image;
		const synopsis = result.synopsis;
		const imagePath = path.join(__dirname, 'cache', 'animeinfo.png');
		const downloadImage = await axios.get(image, {
			responseType: 'arraybuffer'
		});
		fs.writeFileSync(imagePath, downloadImage.data);
		const message = `Title: ${title}\nEnglish: ${title_english}\nType: ${type}\nEpisodes: ${episodes}\nStatus: ${status}\nAired: ${aired}\nPremiered: ${premiered.replace(/None None/g, 'None')}\nBroadcast: ${broadcast}\nStudio: ${studio}\nGenre: ${genres}\nTheme: ${theme}\nRating: ${rating}\n\nSynopsis:\n${synopsis}`;
		return api.sendMessage({
			body: message,
			attachment: fs.createReadStream(imagePath)
		}, event.threadID, () => fs.unlinkSync(imagePath));
	} catch (error) {
		console.log(error);
		return api.sendMessage(`Searching failed or anime not found`, event.threadID, event.messageID);
	}
}