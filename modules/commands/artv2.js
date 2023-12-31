const axios = require('axios');
const fs = require('fs');
const path = require('path');
module.exports.config = {
    name: 'artv2',
    version: '1.0.1',
    credits: 'Aki Hayakawa',
    hasPermission: 0,
    usePrefix: true,
    description: 'Create an art version of an image',
    commandCategory: 'image',
    usages: '[reply to an image]',
    cooldowns: 0,
};
module.exports.run = async function ({
    api,
    event
}) {
    const {
        messageReply,
        threadID,
        messageID,
        attachments
    } = event;
    if (!messageReply && attachments.length === 0) {
        api.setMessageReaction(`👎`, event.messageID);
        return api.sendMessage('Please reply to an image or attach an image.', threadID, messageID);
    }
    api.setMessageReaction(`👍`, event.messageID);
    const imageUrl = messageReply ? messageReply.attachments[0].url : attachments[0].url;
    const encodedImageUrl = encodeURIComponent(imageUrl);
    const userInfo = await api.getUserInfo(event.senderID);
    const userName = userInfo[event.senderID]?.name;
    const akiUrl = `https://nams.live/naural-art.json?{"image":"${encodedImageUrl}","prompt":""}`;
    fetch(akiUrl)
        .then(response => response.text())
        .then(html => {
            const linkRegex = /(https?:\/\/[^\s]+)/;
            const match = html.match(linkRegex);
            const linkRegex2 = /^Server Error$/;
            const match2 = html.match(linkRegex2);
            if (match) {
                const apiUrl = match[0];
                axios.get(apiUrl, {
                    responseType: 'arraybuffer'
                })
                    .then(response => {
                        const outputPath = path.join(__dirname, 'cache', 'art.png');
                        fs.writeFileSync(outputPath, response.data);
                        api.sendMessage({
                            body: `Here's your image ${userName}`,
                            attachment: fs.createReadStream(outputPath),
                            mentions: [{
                                tag: userName,
                                id: event.senderID
                            }]
                        }, threadID, () =>
                            fs.unlinkSync(outputPath));
                    })
                    .catch(error => {
                        console.error("Error while fetching image data:", error);
                    });
            } else if (match2) {
                api.setMessageReaction(`👎`, event.messageID);
                api.sendMessage({
                    body: `That image isn't allowed due to nudity or explicit content, ${userName}. Please choose another one.`,
                    mentions: [{
                        tag: userName,
                        id: event.senderID
                    }]
                }, threadID);
            } else {
                api.setMessageReaction(`👎`, event.messageID);
                api.sendMessage({
                    body: `Something went wrong with the server.`,
                    mentions: [{
                        tag: userName,
                        id: event.senderID
                    }]
                }, threadID);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}