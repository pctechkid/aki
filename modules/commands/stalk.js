module.exports.config = {
  name: "stalk",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Aki Hayakawa",
  description: "Stalk profile from Facebook, Github, or Tiktok",
  usePrefix: true,
  commandCategory: "tools",
  usages: "stalk fb, stalk github, stalk tiktok",
  cooldowns: 5,
};

const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports.run = async ({
  api,
  event,
  args
}) => {
  try {

      const platform = args[0]?.toLowerCase();
      var id;
      if (args.join().indexOf('@') !== -1) {
          id = Object.keys(event.mentions);
      } else if (event.type == "message_reply" && platform === 'fb') {
          id = event.messageReply.senderID;
      } else if (args[1]) {
          id = args[1]?.toLowerCase();
      } else if (platform === 'fb' && !args[1]) {
          id = event.senderID;
      } else if (platform === 'github' && !args[1]) {
          return api.sendMessage(`Github username is blank. Please enter a valid username.`, event.threadID, event.messageID);
      } else if (platform === 'tiktok' && !args[1]) {
          return api.sendMessage(`Tiktok username is blank. Please enter a valid username.`, event.threadID, event.messageID);
      }

      if (platform === "github" || platform === "tiktok") {
          const details = await getUserDetails(platform, id);
          const message = `${details}`;
          const coverPath = path.join(__dirname, `/cache/stalk_${event.senderID}.png`);
          const responseCover = await axios.get(`https://api-test.yourboss12.repl.co/stalk/${platform}?&id=${id}`);
          const linkCover = responseCover.data.av;
          const downloadCover = (await axios.get(linkCover, {
              responseType: 'arraybuffer'
          })).data;
          fs.writeFileSync(coverPath, Buffer.from(downloadCover, 'utf-8'));
          api.setMessageReaction('👍', event.messageID, (err) => {}, true );
          api.sendMessage({
              body: message.replace(/profile\.php\?id=/g, '')
                  .replace(/Uid:/g, 'ID:')
                  .replace(/\bmale\b/g, 'Male')
                  .replace(/\bfemale\b/g, 'Female')
                  .replace(/No Data! with No Data/g, 'None')
                  .replace(/unknown/g, 'Unknown'),
              attachment: fs.createReadStream(coverPath)
          }, event.threadID, (err) => {
              fs.unlinkSync(coverPath);
          }, event.messageID);
        } else if (platform === "fb") {
            if (args[1] && args[1].startsWith("https://www.facebook.com/")){
                const fburl = await axios.get(`https://nguyen-chard-api.joshuag06.repl.co/api/tools/fuid?link=${encodeURIComponent(args.join(" "))}`);
                id = fburl.data.result;
            }
            const coverPath = path.join(__dirname, `/cache/stalk_${event.senderID}.png`);
            const res = await axios.get(`https://nguyen-chard-api.joshuag06.repl.co/api/tools/fb_info?uid=${id}`);
            const linkCover = res.data.avatar;
            const name = res.data.name;
            const link_profile = res.data.link_profile;
            const uid = res.data.uid;
            const username = res.data.username || "None";
            const gender = res.data.gender || "Unknown";
            const birthday = res.data.birthday || "Not public";
            const age = res.data.age || "Unknown";
            const hometown = res.data.hometown || "Unknown";
            const relationship_status = res.data.relationship_status || "Unknown";
            const updated_times = res.data.updated_times || "None";
            const created_time = res.data.created_time || "None";
            const follower = res.data.follower || "None";
            const message = `Name: ${name}\nID: ${uid}\nUsername: ${username}\nGender: ${gender}\nBirthday: ${birthday}\nAge: ${age}\nHometown: ${hometown}\nFollowers: ${follower}\nRelationship Status: ${relationship_status}\nCreated: ${created_time}\nUpdated: ${updated_times}\n\n${link_profile}`
            const months = {
                January: "Jan",
                February: "Feb",
                March: "Mar",
                April: "Apr",
                May: "May",
                June: "Jun",
                July: "Jul",
                August: "Aug",
                September: "Sep",
                October: "Oct",
                November: "Nov",
                December: "Dec",
              };
            const downloadCover = (await axios.get(linkCover, {
                responseType: 'arraybuffer'
            })).data;
            fs.writeFileSync(coverPath, Buffer.from(downloadCover, 'utf-8'));
            api.setMessageReaction('👍', event.messageID, (err) => {}, true );
            api.sendMessage({
                body: message.replace(/profile\.php\?id=/g, '')
                             .replace(/www\./g, '')
                             .replace(/No data!/g, 'None')
                             .replace(/\bmale\b/g, 'Male')
                             .replace(/\bfemale\b/g, 'Female')
                             .replace(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/g, match => months[match]),
                attachment: fs.createReadStream(coverPath)
            }, event.threadID, (err) => {
                fs.unlinkSync(coverPath);
            }, event.messageID);
        } else {
          api.setMessageReaction('👎', event.messageID, (err) => {}, true );
          api.sendMessage(`Invalid input.\nUsage:\n\n${global.config.PREFIX}stalk fb <@mention or uid>\n${global.config.PREFIX}stalk github <username>\n${global.config.PREFIX}stalk tiktok <username>`, event.threadID);
      }
  } catch (error) {
      api.setMessageReaction('👎', event.messageID, (err) => {}, true );
      api.sendMessage("An error occurred while fetching the details.", event.threadID);
  }
};

async function getUserDetails(platform, id) {
  try {
      const response = await axios.get(`https://api-test.yourboss12.repl.co/stalk/${platform}?&id=${id}`);
      return response.data.result;
  } catch (error) {
      api.setMessageReaction('👎', event.messageID, (err) => {}, true );
      console.error(`Error fetching ${platform} details from the API:`, error);
      throw new Error(`Failed to fetch ${platform} details from the API.`);
  }
}