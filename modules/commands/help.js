module.exports.config = {
	name: "help",
	version: "1.0.2",
	hasPermission: 0,
	credits: "Aki Hayakawa",
	description: "Beginner's Guide",
	usePrefix: true,
	commandCategory: "guide",
	usages: "Display bot commands",
	cooldowns: 5,
	envConfig: {
	  autoUnsend: false,
	  delayUnsend: 30
	}
  };
  
  const axios = require("axios");
  const fs = require("fs-extra");


  module.exports.languages = {
	en: {
	  moduleInfo:
		"%1\n%2\n\nUsage : %3\nwaiting time : %4 seconds(s)\npermission : %5\n\nmodule code by %6.",
	  helpList:
		`Total: %1 commands`,
	  user: "user",
	  adminGroup: "group admin",
	  adminBot: "bot admin",
	},
  };
  
  module.exports.run = async function ({ api, event, args, getText }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
	const prefix = threadSetting.hasOwnProperty("PREFIX")
	  ? threadSetting.PREFIX
	  : global.config.PREFIX;
  
	const commandList = Array.from(commands.values());
	const sortedCommands = commandList
	  .map((cmd) => `${global.config.PREFIX}${cmd.config.name}`) // Add prefix before each command
	  .sort((a, b) => a.localeCompare(b)); // Sort commands alphabetically
  
	const itemsPerPage = 10;
	const totalPages = Math.ceil(sortedCommands.length / itemsPerPage);
  
	let currentPage = 1;
	if (args[0]) {
	  const parsedPage = parseInt(args[0]);
	  if (!isNaN(parsedPage) && parsedPage >= 1 && parsedPage <= totalPages) {
		currentPage = parsedPage;
	  } else {
		return api.sendMessage(
		  `Oops, you went too far. Please choose a page between 1 and ${totalPages}.`,
		  threadID,
		  messageID
		);
	  }
	}
  
	const startIdx = (currentPage - 1) * itemsPerPage;
	const endIdx = startIdx + itemsPerPage;
	const visibleCommands = sortedCommands.slice(startIdx, endIdx);
  
	let msg = `${visibleCommands.join("\n")}\n\n`;
  
	const numberFontPage = Array.from({ length: totalPages }, (_, i) => (i + 1).toString());
	
	msg += `Page: ${numberFontPage[currentPage - 1]} of ${numberFontPage[totalPages - 1]}\n`;
	msg += getText("helpList", commands.size);
	msg += `\n\nNote: To go to another page, type ${global.config.PREFIX}help <page number>\nExample: .help 2`;
  
	const imgP = [];
	const img = [
	  "https://i.imgur.com/PfmmlIJ.gif"
	];
	const rdimg = img[Math.floor(Math.random() * img.length)];
	const help = __dirname + "/cache/aki.gif";
	let getAkihelp = (await axios.get(`${rdimg}`, {
		responseType: 'arraybuffer'
	})).data;
	fs.writeFileSync(help, Buffer.from(getAkihelp, "utf-8"));

	const msgg = {
	  body: `LIST OF COMMANDS\n\n` + msg + `\n\n`,
	  attachment: fs.createReadStream(help)
	};
  
	const sentMessage = await api.sendMessage(msgg, threadID, async (error, info) => {
	  if (autoUnsend) {
		await new Promise(resolve => setTimeout(resolve, delayUnsend * 500));
		return api.unsendMessage(info.messageID);
	  } else return;
	}, messageID);
  };