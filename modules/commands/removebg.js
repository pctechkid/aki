module.exports.config = {
    name: 'removebg',
    version: '1.1.1',
    hasPermssion: 0,
    credits: 'Aki Hayakawa',
    description: 'Edit photo',
    commandCategory: 'Tools',
    usePrefix: true,
    usages: 'Reply on an image',
    cooldowns: 2,
    dependencies: {
        'form-data': '',
        'image-downloader': ''
    }
};
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const {
    image
} = require('image-downloader');
module.exports.run = async function ({
    api,
    event,
    args
}) {
    try {
        const userInfo = await api.getUserInfo(event.senderID);
        const userName = userInfo[event.senderID]?.name;
        if (event.type !== "message_reply") {
            api.setMessageReaction("👎", event.messageID, (err) => { }, true);
            return api.sendMessage(`Reply on an image with the command ${global.config.PREFIX}removebg`, event.threadID, event.messageID);
        }
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("Success! ❎", event.threadID, event.messageID);
        if (event.messageReply.attachments[0].type != "photo") {
            api.setMessageReaction("👎", event.messageID, (err) => { }, true);
            return api.sendMessage("Failed to remove background for that image.", event.threadID, event.messageID);
        }
        const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
        // const MtxApi = ["5i2MR5okQVncjTX1A1dDjk66"] personal key
        // const MtxApi = ["UB8WrY6YRzeeZDTsxv9NYQ9C"] hexabot key
        const MtxApi = ["5i2MR5okQVncjTX1A1dDjk66", "33CBAhPzQVJWGELjsiYErCGL", "1w6iBv13zrLmLRokRzwTEi2z", "fkTf9N3oKbeGfnCr18yG62Re", "2y3QakeKxQgVpiLKUxzAos6K", "Z4V2twnqfQKBBh9U9VN29Sto", "FjMTH4XGeH2CS1VwjJfKVVDC", "vSbwjPT4LS5R29MPnEc6YCiz", "jPys5suWKaLWuxZa1gvqDwKg", "bxGiLBquKpkXnY716dg9Tdvm"]
        // Define the path to the cache folder.
        const cacheFolderPath = path.resolve(__dirname, 'cache');
        // Ensure the cache folder exists, and if not, create it.
        if (!fs.existsSync(cacheFolderPath)) {
            fs.mkdirSync(cacheFolderPath);
        }
        // Define the path to the removebg.txt file within the cache folder.
        const sequenceFilePath = path.resolve(cacheFolderPath, 'removebg.txt');
        // Read the current sequence number from removebg.txt file.
        let sequenceNumber = parseInt(fs.readFileSync(sequenceFilePath, 'utf8'));
        // Function to get the next API key in the sequence.
        function getNextApiKey() {
            const apiKey = MtxApi[sequenceNumber];
            // Increment the sequence number and update removebg.txt file.
            sequenceNumber = (sequenceNumber + 1) % MtxApi.length;
            fs.writeFileSync(sequenceFilePath, sequenceNumber.toString(), 'utf8');
            return apiKey;
        }
        const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
        await image({
            url: content,
            dest: inputPath
        });
        api.setMessageReaction("👍", event.messageID, (err) => { }, true);
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
        // Get the next API key and console.log it.
        const apiKey = getNextApiKey();
        console.log('REMOVEBG API KEY USED:', apiKey);
        axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': apiKey, // Use the next API key in the sequence.
            },
            encoding: null
        })
            .then((response) => {
                if (response.status != 200) {
                    api.sendMessage("Check API key", event.threadID, event.messageID);
                    api.setMessageReaction("👎", event.messageID, (err) => { }, true);
                    return console.error('Error:', response.status, response.statusText);
                }
                fs.writeFileSync(inputPath, response.data);
                return api.sendMessage({
                    body: `Here's your image ${userName}`,
                    attachment: fs.createReadStream(inputPath),
                    mentions: [{
                        tag: userName,
                        id: event.senderID
                    }]
                }, event.threadID, () => fs.unlinkSync(inputPath));
            })
            .catch((error) => {
                api.setMessageReaction("👎", event.messageID, (err) => { }, true);
                api.sendMessage("Please try again.", event.threadID, event.messageID);
                return console.error('MTX Server Fail: ', error);
            });
    } catch (e) {
        api.setMessageReaction("👎", event.messageID, (err) => { }, true);
        api.sendMessage("Please try again.", event.threadID, event.messageID);
        console.log(e)
    }
}