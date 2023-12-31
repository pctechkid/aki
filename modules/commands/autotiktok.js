module.exports.config = {
    name: "autotiktok",
    author: "Aki Hayakawa",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Aki Hayakawa",
    description: "Tiktok auto downloader",
    usePrefix: true,
    commandCategory: "tools",
    cooldowns: 0,
};

const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.handleEvent = async function({
    api,
    event,
    client,
    __GLOBAL
}) {
    if (!event.body) {
        return; // Return early if event body is undefined or empty
    }

    const userChat = event.body;

    try {
        if (userChat.startsWith("https://vt.tiktok.com/") || userChat.startsWith("https://vm.tiktok.com/") || userChat.startsWith("https://www.tiktok.com/") || userChat.startsWith("https://tiktok.com/")) {
            const responseTiktok = await axios.get(`https://www.tikwm.com/api/?url=${userChat}`);
            const linkTiktok = responseTiktok.data.data.play || responseTiktok.data.data.wmplay; // Use noWatermark if available, otherwise use watermark

            api.setMessageReaction("👍", event.messageID, (err) => {}, true);

            const downloadTiktokResponse = await axios.get(linkTiktok, {
                responseType: 'arraybuffer'
            });

            // Extract the file extension from the Content-Type header
            const contentType = downloadTiktokResponse.headers['content-type'];
            const fileExtension = getFileExtension(contentType);

            const tiktokFilePath = path.join(__dirname, `/cache/tiktok_${event.senderID}${fileExtension}`);
            fs.writeFileSync(tiktokFilePath, Buffer.from(downloadTiktokResponse.data, 'utf-8'));

            if (fileExtension === ".mp3" || fileExtension === ".m4a") {
                const tiktokCoverPath = path.join(__dirname, `/cache/tiktokCover_${event.senderID}.png`);
                const linkTiktokCover = responseTiktok.data.data.cover;
                const downloadTiktokCoverResponse = await axios.get(linkTiktokCover, {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(tiktokCoverPath, Buffer.from(downloadTiktokCoverResponse.data, 'utf-8'));
                api.sendMessage({
                    body: ``,
                    attachment: fs.createReadStream(tiktokCoverPath)
                }, event.threadID, (err) => {
                    fs.unlinkSync(tiktokCoverPath);
                }, event.messageID);
            }

            api.sendMessage({
                body: ``,
                attachment: fs.createReadStream(tiktokFilePath)
            }, event.threadID, (err) => {
                fs.unlinkSync(tiktokFilePath);
                if (err) return api.setMessageReaction("👎", event.messageID, (err) => {}, true);
            }, event.messageID);
        }
    } catch (err) {
        console.log(err);
    }
};

function getFileExtension(contentType) {
    switch (contentType) {
        case 'audio/mpeg':
            return '.mp3';
        case 'audio/mp4':
            return '.m4a';
        // Add more cases for other content types as needed
        default:
            return '.mp4';
    }
}

module.exports.run = function({
    api,
    event,
    client,
    __GLOBAL
}) {}