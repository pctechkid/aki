const axios = require("axios");
const fs = require("fs");
const { createReadStream, unlinkSync } = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "aniprofile",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Aki Hayakawa",
  description: "Create custom anime avatars",
  usePrefix: true,
  commandCategory: "image",
  usages: "aniavatar [name] [signature]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
  },
};

module.exports.run = async function ({ api, event, args }) {
  // Check if both name and signature are provided
  if (args.length < 2) {
    const errorMessage = `Invalid input.\n\nUsage:\n${global.config.PREFIX}aniprofile <name> <signature>`;
    return api.sendMessage({ body: errorMessage }, event.threadID, event.messageID);
  }

  const name = args.slice(0, -1).join(" "); // Combine all words except the last one as the name
  const signature = args[args.length - 1]; // The last word is the signature

  const file = path.join(__dirname, "/cache", `aniavatar_${event.senderID}.png`);
  const randomid = Math.floor(Math.random() * 757) + 1;

  try {
    const getFile = (await axios.get(`https://bngssvcas--oiqoweiusncxc.repl.co/canvas/avatarwibu?id=${randomid}&chu_nen=${name}&chu_ky=${signature}`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(file, Buffer.from(getFile, 'utf-8'));
    api.sendMessage({ attachment: createReadStream(file) }, event.threadID, () => unlinkSync(file), event.messageID);
  } catch (error) {
    console.log(error);
  }
};
