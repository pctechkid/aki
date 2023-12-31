module.exports.config = {
  name: "dog",
  version: "1.0.0",
  credits: "Aki Hayakawa",
  description: "Send random dog pics",
  hasPermssion: 0,
  commandCategory: "other",
  usage: "[dog]",
  cooldowns: 0,
  dependencies: [],
  usePrefix: true
};

module.exports.run = async function({ api, event }) {
  const axios = require("axios");
  const request = require('request');
  const fs = require("fs");
  const path = require("path"); // Import the 'path' module

  try {
    let data = await axios.get('https://sensui-useless-apis.codersensui.repl.co/api/fun/dogpic');
    var fileExtension = path.extname(data.data.picture); // Extract the file extension from the URL
    var fileName = `dog${fileExtension}`; // Create a file name with the correct extension

    var file = fs.createWriteStream(__dirname + `/cache/${fileName}`);
    var rqs = request(encodeURI(data.data.picture));
    let filePath = __dirname + `/cache/${fileName}`;
    rqs.pipe(file);
    file.on('finish', async () => {
      api.sendMessage({
        attachment: fs.createReadStream(__dirname + `/cache/${fileName}`)
      }, event.threadID, async () => {
        // After sending the message, delete the picture file
        try {
          await fs.promises.unlink(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
