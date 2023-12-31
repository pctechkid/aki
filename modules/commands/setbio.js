module.exports.config = {
  name: "setbio",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Aki Hayakawa",
  description: "Change bot's bio",
  usePrefix: true,
  commandCategory: "system",
  usages: "bio [text]",
  cooldowns: 5

}

module.exports.run = async ({
  api,
  event,
  global,
  args,
  permssion,
  utils,
  client,
  Users
}) => {
  api.changeBio(args.join(" "), (e) => {
      if (e) api.sendMessage("An error occurred" + e, event.threadID);
      return api.sendMessage("Successfully changed the biography of the bot into:\n\n" + args.join(" "), event.threadID, event.messgaeID)
  })
}