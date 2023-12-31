module.exports.config = {
  name: "imagesearch",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aki Hayakawa",
  description: "Search an Image",
  usePrefix: true,
  commandCategory: "image",
  usages: "imagesearch [text]",
  cooldowns: 10,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "googlethis": "",
    "cloudscraper": ""
  }
};

module.exports.run = async ({ matches, event, api, extra, args }) => {

  const axios = global.nodemodule['axios'];
  const google = global.nodemodule["googlethis"];
  const cloudscraper = global.nodemodule["cloudscraper"];
  const fs = global.nodemodule["fs"];

  const input = event.body;
  var query = args.join(" ");
  
  if (event.type == "message_reply") {
    query = event.messageReply.body;
  }
  
  if (!query || query.trim() === '') {
    return api.sendMessage("Please enter image search query or reply to a message you want to search", event.threadID);
  }

  api.sendMessage(`Searching images. Please wait ✅`, event.threadID, event.messageID);

  let result = await google.image(query, { safe: false });
  if (result.length === 0) {
    api.sendMessage(`Your image search did not return any result.`, event.threadID, event.messageID)
    return;
  }

  let streams = [];
  let counter = 0;

  for (let image of result) {
    // Only show 9 images
    if (counter >= 9)
      break;
    let url = image.url;
    if (!url.endsWith(".jpg") && !url.endsWith(".png"))
      continue;

    let path = __dirname + `/cache/search-image-${counter}.jpg`;
    let hasError = false;
    await cloudscraper.get({ uri: url, encoding: null })
      .then((buffer) => fs.writeFileSync(path, buffer))
      .catch((error) => {
        console.log(error)
        hasError = true;
      });

    if (hasError)
      continue;    streams.push(fs.createReadStream(path).on("end", async () => {
      if (fs.existsSync(path)) {
        fs.unlink(path, (err) => {
          if (err) return console.log(err);
        });
      }
    }));

    counter += 1;
  }

  let msg = {
    attachment: streams
  };
  api.sendMessage(msg, event.threadID, event.messageID);
};