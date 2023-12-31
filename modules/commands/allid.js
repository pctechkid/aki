module.exports.config = {
  name: "allid",
  version: "2.0.0",
  hasPermission: 0,
  credits: "Aki Hayakawa",
  description: "User and group id in one file",
  usePrefix: true,
  commandCategory: "system",
  usages: "allid (mention user)",
  cooldowns: 5,
  dependencies: '',
};
module.exports.run = async function({
  api,
  event
}) {
  const tid = event.threadID;
  const uid = event.senderID;
  const userName = (await api.getUserInfo(uid))[uid].name;
  if (!event.mentions || Object.keys(event.mentions).length === 0) {
      const message = `ALL ID:\n\nThread ID: ${tid}\nUser ID: ${uid}\nName: ${userName}`;
      return api.sendMessage(message, event.threadID);
  } else {
      const mentionedUsers = Object.keys(event.mentions).map((id) => ({
          id,
          name: event.mentions[id],
      }));
      const message = `Thread ID: ${tid}\nUser ID: ${uid}\nUser Name: ${userName}\n\nMentioned Users:\n`;
      const mentionedUsersInfo = mentionedUsers.map((user) => `${user.name.replace('@', '')} - ${user.id}`);
      return api.sendMessage(message + mentionedUsersInfo.join('\n'), event.threadID);
  }
};