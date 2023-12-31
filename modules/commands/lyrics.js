module.exports.config = {
  name: "lyrics",
  version: "2.0.4",
  hasPermssion: 0,
  credits: "Aki Hayakawa",
  description: "Play a song with lyrics",
  usePrefix: true,
  commandCategory: "utility",
  usages: "[title]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const ytdl = require("@distube/ytdl-core");
  const yts = require("yt-search");
  const path = require('path');

  const input = event.body;
  const data = input.split(" ");

  if (data.length < 2 && event.type != "message_reply") {
    return api.sendMessage("Please enter a valid song", event.threadID);
  }

  data.shift();
  let song = data.join(" ").replace(/\bby \b/g, '');
  if (event.type == 'message_reply') {
    song = event.messageReply.body.replace(/\bby \b/g, '');
  }

  try {
    api.sendMessage(`Searching lyrics. Please wait ✅`, event.threadID, event.messageID);
    const queryLink = await axios.get(`https://api-ronnel.vercel.app/search?title=${encodeURIComponent(song)}`);
    var title, artist, album, lyrics, full_title;
    if (queryLink.data) {
      title = queryLink.data.title;
      artist = queryLink.data.artist;
      album = queryLink.data.album;
      lyrics = queryLink.data.lyrics;
      full_title = `${title} by ${artist}`;
    } else {
      title = "Not found";
      artist = "Not found";
      lyrics = "Lyrics: Not found"
      album = "";
    }

    const albumPath = path.join(__dirname, "/cache", `lyrics_album.png`);
    const downloadAlbum = await axios.get(album, {
      responseType: 'arraybuffer'
    });
    fs.writeFileSync(albumPath, Buffer.from(downloadAlbum.data, 'utf-8'));

    const searchResults = await yts(full_title);
    if (!searchResults.videos.length) {
      return api.sendMessage("Error: Invalid request.", event.threadID, event.messageID);
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const stream = ytdl(videoUrl, { filter: "audioonly" });

    const fileName = `lyrics.mp3`;
    const filePath = __dirname + `/cache/${fileName}`;

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', async () => {
      console.info('[DOWNLOADER] Downloaded');

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID);
      }

      const textMessage = `Title: ${title}\nArtist: ${artist}\n\n${lyrics}`;
      api.sendMessage({
        body: textMessage,
        attachment: fs.createReadStream(albumPath)
      }, event.threadID, () => fs.unlinkSync(albumPath));

      const attachmentMessage = {
        attachment: fs.createReadStream(filePath)
      };

      api.sendMessage(attachmentMessage, event.threadID, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage('Song not found', event.threadID, event.messageID);
  }
};
