module.exports.config = {
	name: "log",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.0.0",
	credits: "Aki Hayakawa",
	description: "Record bot activity notifications!",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Threads }) {
    //Added new date and time format
    var now = new Date();
now.setUTCHours(now.getUTCHours() + 8); // Adjust for UTC+8
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var formattedDate = months[now.getUTCMonth()] + " " +
                    ("0" + now.getUTCDate()).slice(-2) + ", " +
                    now.getUTCFullYear() + " " +
                    ("0" + (now.getUTCHours() % 12 || 12)).slice(-2) + ":" +
                    ("0" + now.getUTCMinutes()).slice(-2) + " " +
                    (now.getUTCHours() >= 12 ? "PM" : "AM");

    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;
    var formReport = "NOTIFICATION:" +
                 "\n\nThread ID: " + event.threadID +
                 "\nAction: {task}" +
                 "\nUser ID: " + event.author +
                 "\n" + formattedDate;
        task = "";
    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "Name does not exist",
                    newName = event.logMessageData.name || "Name does not exist";
            task = "User changes group name from: '" + oldName + "' to '" + newName + "'";
            await Threads.setData(event.threadID, {name: newName});
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = "The user added the bot to a new group!";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId== api.getCurrentUserID()) task = "The user kicked the bot out of the group!"
            break;
        }
        default: 
            break;
    }

    if (task.length == 0) return;

    formReport = formReport
    .replace(/\{task}/g, task);

    return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
        if (error) return logger(formReport, "[ Logging Event ]");
    });
}