module.exports.config = {
    name: "autofb",
    author: "Aki Hayakawa",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Aki Hayakawa",
    description: "Facebook auto downloader",
    usePrefix: true,
    commandCategory: "tools",
    cooldowns: 0,
};

const axios = require('axios');
const fs = require('fs');

module.exports.handleEvent = async function({
    api,
    event,
    client,
    __GLOBAL
}) {

    if (!event.body) {
        return; // Return early if event body is undefined or empty
    }

    const fbFilePath = __dirname + "/cache/fb_" + event.senderID + ".mp4";
    const userChat = event.body;

    try {
        if (userChat.startsWith("https://www.facebook.com/") || userChat.startsWith("https://fb.watch") || userChat.startsWith("https://www.facebook.com/reel/")) {
            const responseFB = await axios.get(`https://ronnel-iptv.serv00.net/facebook.php?url=${userChat}`);
            const linkHD = responseFB.data.links.HD;
            const linkSD = responseFB.data.links.SD;

            // Function to check the file size
            const checkFileSize = async (link) => {
                const response = await axios.head(link);
                const contentLength = parseInt(response.headers['content-length'], 10);
                return contentLength;
            };

            if (!linkHD || linkHD === '') {
                // If HD link is empty, switch to SD
                const sdFileSize = await checkFileSize(linkSD);

                if (sdFileSize > 26214400) {
                    api.sendMessage("The file could not be sent because it is larger than 25MB.", event.threadID);
                    return;
                }

                api.setMessageReaction("👍", event.messageID, (err) => {}, true);
                const downloadFB = (await axios.get(linkSD, {
                    responseType: 'arraybuffer'
                })).data;
                fs.writeFileSync(fbFilePath, Buffer.from(downloadFB, 'utf-8'));
            } else {
                const hdFileSize = await checkFileSize(linkHD);

                if (hdFileSize <= 26214400) { // 25MB in bytes
                    api.setMessageReaction("👍", event.messageID, (err) => {}, true);
                    const downloadFB = (await axios.get(linkHD, {
                        responseType: 'arraybuffer'
                    })).data;
                    fs.writeFileSync(fbFilePath, Buffer.from(downloadFB, 'utf-8'));
                } else {
                    // HD file size exceeds 25MB, switch to SD
                    const sdFileSize = await checkFileSize(linkSD);

                    if (sdFileSize > 26214400) {
                        api.setMessageReaction("👎", event.messageID, (err) => {}, true);
                        api.sendMessage("The file could not be sent because it is larger than 25MB.", event.threadID);
                        return;
                    }

                    api.setMessageReaction("👍", event.messageID, (err) => {}, true);
                    const downloadFB = (await axios.get(linkSD, {
                        responseType: 'arraybuffer'
                    })).data;
                    fs.writeFileSync(fbFilePath, Buffer.from(downloadFB, 'utf-8'));
                }
            }

            api.sendMessage({
                body: ``,
                attachment: fs.createReadStream(fbFilePath)
            }, event.threadID, (err) => {
                fs.unlinkSync(fbFilePath);
                if (err) return api.setMessageReaction("👎", event.messageID, (err) => {}, true);
            }, event.messageID);
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports.run = function({
    api,
    event,
    client,
    __GLOBAL
}) {}
