module.exports.config = {
	name: 'movie',
	version: '1.0',
	hasPermssion: 0,
	credits: 'Aki Hayakawa',
	description: '',
	usePrefix: true,
	commandCategory: 'tool',
	usages: '',
	cooldowns: 0,
};

module.exports.run = async function ({ api, event, args }) {
	try {
		const axios = require('axios');
		const fs = require('fs');
		const path = require('path');
		const search = args.join(' ');
		if (!search)
			return api.sendMessage(`Invalid input. Movie title is missing!`, event.threadID, event.messageID);
		const link = (await axios.get(`https://api-ronnel.vercel.app/movie?title=${encodeURIComponent(search)}`)).data;
		const title = link.result.title;
		const released = link.result.released;
		const status = link.result.status;
		const runtime = link.result.runtime;
		const popularity = link.result.popularity;
		const genre = link.result.genre;
		const language = link.result.language;
		const overview = link.result.overview;
		const poster = link.result.poster;
		const backdrop = link.result.backdrop;
		const downloadPoster = await axios.get(poster, {
			responseType: 'arraybuffer'
		});
		const posterPath = path.join(__dirname, 'cache', 'poster.jpg');
		fs.writeFileSync(posterPath, downloadPoster.data);
		const downloadBackdrop = await axios.get(backdrop, {
			responseType: 'arraybuffer'
		});
		const backdropPath = path.join(__dirname, 'cache', 'backdrop.jpg');
		fs.writeFileSync(backdropPath, downloadBackdrop.data);
		const attachmentArray = [];
		attachmentArray.push(fs.createReadStream(posterPath));
		attachmentArray.push(fs.createReadStream(backdropPath));
		console.log(overview);
		return api.sendMessage({
			body: `Title: ${title}\nReleased: ${released}\nStatus: ${status}\nDuration: ${runtime}\nPopularity: ${popularity}\nGenre: ${genre}\nLanguage: ${language}\n\nOverview:\n${overview}`,
			attachment: attachmentArray
		}, event.threadID, () => {
			fs.unlinkSync(posterPath);
			fs.unlinkSync(backdropPath);
		}, event.messageID);
	} catch (error) {
		console.log(error);
		return api.sendMessage(`Movie not found`, event.threadID, event.messageID);
	}
}