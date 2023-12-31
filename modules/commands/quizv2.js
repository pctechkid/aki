module.exports.config = {
    name: "quizv2",
    version: "2.0.0",
    credits: "Aki Hayakawa",
    hasPermssion: 0,
    usePrefix: true,
    description: "Answer questions",
    commandCategory: "Games",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.handleReaction = ({
    api,
    event,
    handleReaction
}) => {
    if (!event.userID == handleReaction.author) return;
    let response = "";
    if (event.reaction != "👍" && event.reaction != "👎") return;
    if (event.reaction == "👍") response = "True"
    else if (event.reaction == "👎") response = "False";
    if (response == handleReaction.answer) api.sendMessage("Your answer is correct", event.threadID, () => {
        setTimeout(function() {
            api.unsendMessage(handleReaction.messageID);
        }, 5000);
    });
    else api.sendMessage(`Your answer is wrong`, event.threadID);
    const indexOfHandle = client.handleReaction.findIndex(e => e.messageID == handleReaction.messageID);
    global.client.handleReaction.splice(indexOfHandle, 1);
    handleReaction.answerYet = 1;
    return global.client.handleReaction.push(handleReaction);
}

module.exports.run = async ({
    api,
    event,
    args
}) => {
    const userInfo = await api.getUserInfo(event.senderID);
    const userName = userInfo[event.senderID]?.name;
    const axios = global.nodemodule["axios"];
    const request = global.nodemodule["request"];
    let difficulties = ["easy", "medium", "hard"];
    let language = args[0];
    let difficulty = args[1];
    if (!language) {
        return api.sendMessage(`Please set language and difficulty\n\nLanguages:\nenglish\ntagalog\n\nDifficulty mode:\neasy\nmedium\nhard\n\nExample usage:\n${global.config.PREFIX}quiz english easy\n${global.config.PREFIX}quiz tagalog hard`, event.threadID, event.messageID);
    }
    if (args[0] === 'tagalog') {
        language = 'tl';
    } else {
        language = 'en';
    }
    (difficulties.some(item => difficulty == item)) ? "" : difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    let fetch = await axios(`https://opentdb.com/api.php?amount=1&encode=url3986&type=boolean&difficulty=${difficulty}`);
    if (!fetch.data) return api.sendMessage("Unable to find the question due to server issues", event.threadID, event.messageID);
    let decode = decodeURIComponent(fetch.data.results[0].question);
    return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${decode}`), (err, response, body) => {
        if (err) return api.sendMessage("An error occurred!", event.threadID, event.messageID);
        var retrieve = JSON.parse(body);
        var text = '';
        retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
        var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0]
        return api.sendMessage({
            body: `Here's a question for you, ${userName}\n\n${text}\n\n👍: True     👎: False`,
            mentions: [{
                tag: userName,
                id: event.senderID
            }]
        }, event.threadID, async (err, info) => {
            global.client.handleReaction.push({
                name: "quiz",
                messageID: info.messageID,
                author: event.senderID,
                answer: fetch.data.results[0].correct_answer,
                answerYet: 0
            });
            await new Promise(resolve => setTimeout(resolve, 20 * 1000));
            const indexOfHandle = global.client.handleReaction.findIndex(e => e.messageID == info.messageID);
            let data = global.client.handleReaction[indexOfHandle];
            if (data.answerYet !== 1) {
                api.sendMessage(`Time is up! The correct answer is ${fetch.data.results[0].correct_answer}`, event.threadID, info.messageID);
                return global.client.handleReaction.splice(indexOfHandle, 1);
            } else return;
        });
    })
}