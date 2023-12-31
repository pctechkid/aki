module.exports.config = {
	name: "outall",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "Aki Hayakawa",
	usePrefix: true,
  description: "Outall thread",
	commandCategory: "Admin",
	usages: "",
	cooldowns: 5
}

module.exports.run = async ({ api, event, args }) => {
  for (const idThread of global.data.allThreadID) {
    api.removeUserFromGroup(api.getCurrentUserID(), idThread)
  }
  		api.sendMessage('Successfully left all groups ✅', event.threadID);
}
