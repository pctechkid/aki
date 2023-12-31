module.exports.config = {
    name: 'rank',
    version: '1.0',
    hasPermssion: 0,
    credits: 'Aki Hayakawa',
    description: '',
    usePrefix: true,
    commandCategory: 'tool',
    usages: '',
    cooldowns: 0,
};

module.exports.run = async function ({ api, event, args }) {
    const canvafy = require('canvafy');
    const fs = require('fs');
    const path = require('path');

    async function generateRankCard() {
        try {
            var id;
            if (event.type === "message_reply") {
                id = event.messageReply.senderID;
            } else if (args[0] && event.mentions) {
                id = Object.keys(event.mentions);
            } else {
                id = event.senderID;
            }

            let userInfo = await api.getUserInfo(id);
            const userName = userInfo[id]?.name;

            const usersData = require('../../includes/database/data/usersData.json');
            const userExp = usersData[id].exp;

            const thread = require('./cache/count.json');
            const data = thread.find(threadData => threadData.threadID === event.threadID);

            if (!data) {
                throw new Error('Thread not found.');
            }

            const expData = data.data;
            expData.sort((a, b) => b.exp - a.exp);

            const currentrank = expData.findIndex(i => i.id == id);
            const level = Math.floor((Math.sqrt(1 + (4 * (userExp + 1) / 3) + 1) / 2));

            const rank = await new canvafy.Rank()
                .setAvatar(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
                .setUsername(userName)
                .setLevel(level)
                .setBackground("color", "#000000")
                .setBorder("#39FF14")
                .setRank(currentrank + 1)
                .setCurrentXp(userExp)
                .setRequiredXp(Math.floor((userExp / level) + userExp))
                .setBarColor("#39FF14")
                .build();

            const rankPath = path.join(__dirname, 'cache', 'rankcard.png');
            fs.writeFileSync(rankPath, rank);
            return api.sendMessage({
                attachment: fs.createReadStream(rankPath)
            }, event.threadID, () => fs.unlinkSync(rankPath))
        } catch (error) {
            console.error("Error generating rank card:", error);
        }
    }
    generateRankCard();
}