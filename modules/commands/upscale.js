exports.config = {
  name: 'upscale',
  version: '0.0.1',
  hasPermission: 0,
  credits: 'Aki Hayakawa',
  description: 'Enhance image resolution',
  usePrefix: true,
  commandCategory: 'image',
  usages: 'Reply to a photo',
  cooldowns: 3
};

let eta = 3;
module.exports.run = async (o) => {
  let send = (msg) => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
  o.api.setMessageReaction(`👍`, o.event.messageID, (err) => {}, true);
  if (o.event.type !== 'message_reply') {
    return send('Please reply with 1 photo!\n');
  }

  send('Enhancing the image ✅');

  let stream = [];
  let exec_time = 0;

  for (let i of o.event.messageReply.attachments) {
    try {
      let res = await require('axios').get(
        encodeURI(
          `https://nams.live/upscale.png?{"image":"${i.url}","model":"4x-UltraSharp"}`
        ),
        {
          responseType: 'stream'
        }
      );

      exec_time += +res.headers.exec_time;
      eta = (res.headers.exec_time / 1000) << 0;
      res.data.path = 'tmp.png';
      stream.push(res.data);
    } catch (e) {}
  }

  send({ attachment: stream });
};
