module.exports.config = {
    name: "removebgv2",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Aki Hayakawa",
    description: "Remove image background automatically",
    usePrefix: true,
    commandCategory: "image",
    usages: "reply to an image",
    cooldowns: 0,
  };
  
  module.exports.run = async (o) => {
      let send = (msg) => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
      o.api.setMessageReaction(`👍`, o.event.messageID, (err) => {}, true);
      if (o.event.type !== 'message_reply') {
        o.api.setMessageReaction(`👎`, o.event.messageID, (err) => {}, true);
        return send(`Usage: Reply on an image with the command ${global.config.PREFIX}removebg\n`);
      }
  
      send('Removing background ✅');
  
      let stream = [];
  
      const axios = require('axios');
      const maxRetries = 50; // You can adjust the number of retries as needed
      let retryCount = 1;
  
      for (let i of o.event.messageReply.attachments) {    
        while (retryCount < maxRetries) {
          try {
            let res = await axios.get(encodeURI(`https://nams.live/rmbg.png?${i.url}`), {
              responseType: 'stream',
            });
      
            if (res.status === 200) {
              res.data.path = 'removebg.png';
              stream.push(res.data);
              break; // Success, exit the loop
            } else {
              // Handle non-200 status codes here if needed
              console.error(`Received status code ${res.status}`);
            }
          } catch (e) {
          }
      
          retryCount++;
        }
      
        if (retryCount === maxRetries) {
          // Handle the case where all retries failed
          o.api.setMessageReaction(`👎`, o.event.messageID, (err) => {}, true);
          o.api.sendMessage(`Failed to remove background for that image.`, o.event.threadID, o.event.messageID);
        }
      }
      console.log(`Number of retries attempted: ${retryCount}`);
      send({ attachment: stream });
  };
  