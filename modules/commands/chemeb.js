module.exports.config = {
  name: "chemeb", 
  version: "1.0.0", 
  hasPermssion: 0, 
  credits: "Aki Hayakawa", 
  description: "Balance the equation at a faster rate than your ex turns your back on", 
  usePrefix: true,
  commandCategory: "general", 
  usages: "chemeb [Equation]", 
  cooldowns: 5, 
  dependencies: {
    "chem-eb": ""
  }, 
  info: [
    {
      key: 'Equation',
      prompt: 'Enter Equation',
      type: 'Document',
      example: 'chemeb H2+O2=H2O'
    },
  ],
  envConfig: {
    //Đây là nơi bạn sẽ setup toàn bộ env của module, chẳng hạn APIKEY, ...
  }
};
module.exports.run = function({ api, event, args, client, __GLOBAL }) {
  //Làm cái gì ở đây tuỳ thuộc vào bạn ¯\_(ツ)_/¯ 
    const chemeb = global.nodemodule["chem-eb"];
//     if (event.type != "message_reply") {
//         var msg = event.messageReply.body;
//         console.log(event.messageReply.body)
//         if (msg.includes('(') && msg.includes(')')) return api.sendMessage(getText('notSupportXYz'), event.threadID, event.messageID);
//         var balanced = chemeb(msg);
//         return api.sendMessage(`=> ${balanced.outChem}`, event.threadID, event.messageID);
//     }
// else
    var msg = args.join(" ");
    if (msg.includes('(') && msg.includes(')')) return api.sendMessage(getText('notSupportXYz'), event.threadID, event.messageID);
    var balanced = chemeb(msg);
    return api.sendMessage(`=> ${balanced.outChem}`, event.threadID, event.messageID);
}