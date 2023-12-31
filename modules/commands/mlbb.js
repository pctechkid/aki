const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "mlbb",
  version: "1.0.1",
  hasPermission: 0,
  credits: "Aki Hayakawa",
  usePrefix: true,
  description: "Send random mlbb clips",
  commandCategory: "General",
  cooldowns: 2,
};

const CACHE_PATH = path.join(__dirname, 'cache');

// Create the cache directory if it doesn't exist
if (!fs.existsSync(CACHE_PATH)) {
  fs.mkdirSync(CACHE_PATH);
}

module.exports.run = async ({ api, event }) => {
  try {
    api.sendMessage("Sending Mobile Legends clip. Please wait ✅", event.threadID);

    const response = await axios.get(`https://video-api.chatbotmesss.repl.co/api/video-urls`);
    const videoUrls = response.data;

    const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

    const videoStreamResponse = await axios.get(randomVideoUrl, { responseType: 'stream' });

    const videoFilePath = path.join(CACHE_PATH, `${Date.now()}.mp4`);

    const fileStream = fs.createWriteStream(videoFilePath);
    videoStreamResponse.data.pipe(fileStream);

    await new Promise((resolve) => {
      fileStream.on('finish', resolve);
    });

    const message = {
      attachment: fs.createReadStream(videoFilePath),
    };

    await api.sendMessage(message, event.threadID);

    // Remove the cached video file
    fs.unlinkSync(videoFilePath);
  } catch (error) {
    console.error('Error fetching or sending the video:', error);
    api.sendMessage("Error sending the video.", event.threadID, event.messageID);
  }
};
