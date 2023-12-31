const axios = require("axios");
const fs = require("fs");

module.exports.config = {
    name: "bard",
    version: "1",
    usePrefix: true,
    hasPermission: 0,
    credits: "Aki Hayakawa",
    description: "Search using Bard",
    commandCategory: "ai",
    usages: "<ask>",
    cooldowns: 5,
};

module.exports.run = async function ({
    api,
    event
}) {
    const {
        threadID,
        messageID,
        type,
        messageReply,
        body
    } = event;

    let question = "";
    if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
        const attachment = messageReply.attachments[0];
        const imageURL = attachment.url;
        question = await convertImageToText(imageURL);

        if (!question) {
            api.sendMessage(
                "Failed to convert the photo to text. Please try again with a clearer photo.",
                threadID,
                messageID
            );
            return;
        }
    } else if (type === "message_reply") {
        question = event.messageReply.body;
    } else {
        question = body.slice(5).trim();

        if (!question) {
            api.sendMessage("Please provide a question or query", threadID, messageID);
            return;
        }
    }

    api.sendMessage("Generating response ✅", threadID, messageID);

    const akiUrl = `https://ask-aki.yootyub.repl.co/bard/${encodeURIComponent(question)}`;

    async function fetchData() {
        try {
            axios.get(akiUrl)
                .then(async (res) => {
                    if (/Response Error/i.test(res.data.content)) {
                        // Do something when the content contains "Response Error" (case-insensitive)
                        return fetchData();
                    } else {
                        // Do something else when it doesn't contain "Response Error"
                        let respond = res.data.content;
                        const imageUrls = res.data.images;
                        // Remove [Image of *any text here* ] from the response
                        respond = respond.replace(/\n\[Image of .*?\]|(\*\*)/g, '').replace(/^\*/gm, '•');
                        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                            const attachments = [];

                            if (!fs.existsSync("cache")) {
                                fs.mkdirSync("cache");
                            }

                            for (let i = 0; i < imageUrls.length; i++) {
                                const url = imageUrls[i];
                                const imagePath = `cache/image${i + 1}.png`;

                                try {
                                    const imageResponse = await axios.get(url, {
                                        responseType: "arraybuffer"
                                    });
                                    fs.writeFileSync(imagePath, imageResponse.data);

                                    attachments.push(fs.createReadStream(imagePath));
                                } catch (error) {
                                    console.error("Error occurred while downloading and saving the image:", error);
                                }
                            }
                            return api.sendMessage({
                                attachment: attachments,
                                body: respond,
                            },
                                threadID, () => {
                                    const folderPath = 'cache';
                                    fs.readdir(folderPath, (err, files) => {
                                        if (err) {
                                            console.error('Error reading folder:', err);
                                            return;
                                        }

                                        files.forEach((file) => {
                                            const filePath = `${folderPath}/${file}`;

                                            fs.unlink(filePath, (err) => {
                                                if (err) {
                                                    console.error(`Error deleting file ${filePath}:`, err);
                                                } else {
                                                    console.log(`Deleted file: ${filePath}`);
                                                }
                                            });
                                        });
                                    });
                                },
                                messageID);
                        } else {
                            return api.sendMessage(respond, threadID, messageID);
                        }
                    }
                })
                .catch((error) => {
                    return api.sendMessage('Something wrong with your question', event.threadID, event.messageID);
                });
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }
    fetchData()
};

async function convertImageToText(imageURL) {
    // const response = await axios.get(`https://sensui-useless-apis.codersensui.repl.co/api/tools/ocr?imageUrl=${encodeURIComponent(imageURL)}`);
    // return response.data.text;
    const response = await axios.get(`https://api.ocr.space/parse/imageurl?apikey=K88477135488957&OCREngine=3&url=${encodeURIComponent(imageURL)}`);
    return response.data.ParsedResults[0].ParsedText;
  }