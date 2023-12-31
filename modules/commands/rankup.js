module.exports.config = {
  name: "rankup",
  version: "7.3.1",
  hasPermssion: 1,
  usePrefix: true,
  credits: "Aki Hayakawa",
  description: "Show rankup notifications",
  commandCategory: "Group",
  dependencies: {
    "fs-extra": ""
  },
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event, Currencies, Users, getText }) {
  function getFirstName(fullName) {
    let names = fullName.split(' ');
    return names[0] || fullName;
  }
  var { threadID, senderID } = event;
  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/rankup.gif";
  // let pathAvt1 = __dirname + "/cache/Avatar.png";

  threadID = String(threadID);
  senderID = String(senderID);

  const thread = global.data.threadData.get(threadID) || {};

  let exp = (await Currencies.getData(senderID)).exp;
  exp = exp += 1;

  if (isNaN(exp)) return;

  if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
    await Currencies.setData(senderID, { exp });
    return;
  }

  const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
  const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

  if (level > curLevel && level != 1) {
    const name1 = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
    let name = getFirstName(name1);
    var messsage = (typeof thread.customRankup == "undefined") ? msg = getText("levelup") : msg = thread.customRankup,
      arrayContent;

    messsage = messsage
      .replace(/\{name}/g, name)
      .replace(/\{level}/g, level);

    const moduleName = this.config.name;

    var background = [
      // "https://i.imgur.com/VAyUUNf.png",
      // "https://i.imgur.com/lHxvt3g.png",
      // "https://i.imgur.com/5RIrt5U.png",
      // "https://i.imgur.com/ImxHke4.png",
      "https://i.imgur.com/HyVIGOH.gif"
    ];
    var rd = background[Math.floor(Math.random() * background.length)];
    // let getAvtmot = (
    //   await axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
    // ).data;
    // fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

    let getbackground = (
      await axios.get(`${rd}`, { responseType: "arraybuffer" })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    // let baseImage = await loadImage(pathImg);
    // let baseAvt1 = await loadImage(pathAvt1);
    // let canvas = createCanvas(baseImage.width, baseImage.height);
    // let ctx = canvas.getContext("2d");
    // ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    // ctx.rotate(0);
    // ctx.drawImage(baseAvt1, 60, 25, 150, 150);
    // const imageBuffer = canvas.toBuffer();
    // fs.writeFileSync(pathImg, imageBuffer);
    // fs.removeSync(pathAvt1);

    api.sendMessage({
      body: messsage,
      mentions: [{
        tag: name,
        id: senderID
      }],
      attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => fs.unlinkSync(pathImg));
  }

  await Currencies.setData(senderID, { exp });
  return;
}

module.exports.languages = {
  "en": {
    "on": "✅ Enabled",
    "off": "❌ Disabled",
    "successText": "notification rankup!",
    "levelup": "🏆 Congratulations {name}\nYou have now reached Level {level}",
  }
}

module.exports.run = async function ({ api, event, Threads, getText }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;

  if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
  else data["rankup"] = false;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
}


// module.exports.config = {
//   name: "rankup",
//   version: "7.3.1",
//   hasPermssion: 1,
//   usePrefix: true,
//   credits: "Aki Hayakawa",
//   description: "Show rankup notifications",
//   commandCategory: "Group",
//   dependencies: {
//     "fs-extra": ""
//   },
//   cooldowns: 2,
// };

// module.exports.handleEvent = async function({ api, event, Currencies, Users, getText }) {
//     var { threadID, senderID } = event;
//     const { createReadStream } = require("fs-extra");
//     const { createCanvas } = require("canvas");
//     const fs = require("fs-extra");
//     const axios = require("axios");
//     const request = require("request"); // Added
//     const pathImg = __dirname + "/cache/rankup.gif";
//     var id1 = event.senderID;

//     threadID = String(threadID);
//     senderID = String(senderID);

//     const thread = global.data.threadData.get(threadID) || {};

//     let exp = (await Currencies.getData(senderID)).exp;
//     exp = exp += 1;

//     if (isNaN(exp)) return;

//     if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
//         await Currencies.setData(senderID, { exp });
//         return;
//     }

//     const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
//     const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

//     if (level > curLevel && level != 1) {
//         const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
//         var message = (typeof thread.customRankup == "undefined") ? getText("levelup") : thread.customRankup;

//         message = message
//             .replace(/\{name}/g, name)
//             .replace(/\{level}/g, level);

//         const moduleName = this.config.name;

//         const imageUrl = await new Promise((resolve, reject) => {
//             const url = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
//             request(url, { followRedirect: false }, (err, res) => {
//                 if (err) reject(err);
//                 resolve(res.headers.location);
//             });
//         });

//         const encodedImageUrl = encodeURIComponent(imageUrl);
//         const gifUrl = `https://api4free.kenliejugarap.com/rankupv2?imglink=${encodedImageUrl}`;
//         const gifBuffer = (await axios.get(gifUrl, { responseType: "arraybuffer" })).data;

//         fs.writeFileSync(pathImg, Buffer.from(gifBuffer, "utf-8"));

//         api.sendMessage({
//             body: message,

//             attachment: fs.createReadStream(pathImg)
//         }, event.threadID, () => fs.unlinkSync(pathImg));
//     }

//     await Currencies.setData(senderID, { exp });
//     return;
// };

// module.exports.languages = {
// 	"vi": {
// 		"off": "𝗧𝗮̆́𝘁",
// 		"on": "𝗕𝗮̣̂𝘁",
// 		"successText": "𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐭𝐡𝐨̂𝐧𝐠 𝐛𝐚́𝐨 𝐫𝐚𝐧𝐤𝐮𝐩 ✨",
// 		"levelup": "{name}, Ang iyong ka astigan ay tumaas ng {level} Levels"
// 	},
// 	"en": {
// 		"on": "✅ Enabled",
// 		"off": "❌ Disabled",
// 		"successText": "rank up notifications!",
// 		"levelup": "🏆 {name}, you now have reached Level {level}",
// 	}
// };

// module.exports.run = async function({ api, event, Threads, getText }) {
// 	const { threadID, messageID } = event;
// 	let data = (await Threads.getData(threadID)).data;

// 	if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
// 	else data["rankup"] = false;

// 	await Threads.setData(threadID, { data });
// 	global.data.threadData.set(threadID, data);
// 	return api.sendMessage(`${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
// };