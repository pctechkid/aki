module.exports.config = {
  name: "unsend",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "Aki Hayakawa",
  description: "Unsend bot's messages",
  usePrefix: true,
  commandCategory: "message",
  usages: "unsend",
  cooldowns: 0
};

module.exports.run = function({ api, event, getText }) {
  // Check if there's a message to reply to
  if (!event.messageReply) {
    return api.sendMessage("You can't unsend a message out of nowhere. Please reply to a message first.", event.threadID, event.messageID);
  }

  if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);

  return api.unsendMessage(event.messageReply.messageID);
}

module.exports.languages = {
  "vi": {
    "returnCant": "Không thể gỡ tin nhắn của người khác.",
    "missingReply": "Hãy reply tin nhắn cần gỡ."
  }
}
