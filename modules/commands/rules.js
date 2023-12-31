module.exports.config = {
	name: "rules",
	version: "1.0.0",
	hasPermission: 0,
	credits: "Aki Hayakawa",
	description: "Displays the terms of using the bot.",
	usePrefix: true,
	commandCategory: "info",
	cooldowns: 1
};

module.exports.run = ({ event, api }) => {
	const rulesMessage = `Terms of using my bot:

⚠️ Please strictly comply to avoid being restricted from using commands.

1. Do not spam bot commands. Excessive use of prefixes may result in bot restrictions.
2. Do not engage in conflicts with other bots (e.g. simulation modules) as they are not real interactive users.
3. Do not abuse the bot for malicious purposes.
4. Refrain from using offensive language with the bot. The bot has an automatic ban mechanism.
5. Avoid resending bot messages.
6. Enjoy your interaction!

Thank you for using the bot responsibly.`;

	api.sendMessage(rulesMessage, event.threadID, event.messageID);
};
