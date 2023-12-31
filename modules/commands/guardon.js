module.exports.config = {
  name: 'guardon',
  version: '1.0.0',
  hasPermssion: 2,
  credits: 'Aki Hayakawa',
  description: 'guard on',
  usePrefix: true,
  commandCategory: 'profile only',
  usages: 'profile guard on',
  cooldowns: 5,
};

module.exports.run = async ({ api, args, event }) => {
  const botID = event.senderID;

  if (!args[0] || !["on", "off"].includes(args[0])) {
    return api.sendMessage('Please specify "on" or "off" to enable or disable the bot avatar shield.', event.threadID);
  }

  const isShielded = args[0] === 'on';

  const form = {
    av: botID,
    variables: JSON.stringify({
      "0": {
        is_shielded: isShielded,
        actor_id: botID,
        client_mutation_id: Math.floor(Math.random() * 20)
      }
    }),
    doc_id: "" // BOT ID
  };

  try {
    const response = await api.sendMessage({
      body: '',
      mentions: [{
        tag: '@fbid',
        id: botID
      }]
    }, event.threadID);

    if (response && response.messageID) {
      form.message_id = response.messageID;

      const res = await api.graphql(form);
      const success = res?.data?.[0]?.is_shielded === isShielded;

      const status = isShielded ? 'enabled' : 'disabled';
      const replyMessage = success ? `Bot avatar shield has been ${status} successfully.` : 'An error occurred. Please try again later.';
      api.sendMessage(replyMessage, event.threadID);
    } else {
      api.sendMessage('An error occurred. Please try again later.', event.threadID);
    }
  } catch (error) {
    api.sendMessage('An error occurred. Please try again later.', event.threadID);
  }
};
