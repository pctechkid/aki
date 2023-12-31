module.exports.config = {
    name: "espn",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Aki Hayakawa",
    description: "Scrape ESPN+ links",
    usePrefix: true,
    commandCategory: "image",
    usages: "espn",
    cooldowns: 5,
    dependencies: {
      "fs-extra": "",
    },
  };
  
  const axios = require("axios");
  const cheerio = require("cheerio");
  const fs = require("fs-extra");
  const path = require('path');
  
  module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    // Define the URL to fetch
    const url = "https://tvnow.best/api/list/alex_079@hotmail.com/kik1ryki1424";
  
    try {
      // Make an HTTP GET request to the URL
      const response = await axios.get(url);
  
      // Check if the request was successful
      if (response.status === 200) {
        // Load the HTML content into Cheerio for parsing
        const $ = cheerio.load(response.data);
  
        // Define the regular expression pattern
        const regexPattern = /^#EXTINF:-1.*group-title="Sports ESPN\+".*(?:\n.*)?$/gm;
  
        // Find all lines that match the pattern
        const matchingLines = $.html().match(regexPattern);
  
        // Check if there are matching lines
        if (matchingLines) {
          // Get the current date and time in UTC+8
          const currentDate = new Date();
          currentDate.setHours(currentDate.getHours());
  
          // Format the date and time as "MM/DD/YY HH:MM AM/PM"
          const formattedDate = currentDate.toLocaleString("en-US", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
  
          try {
            // Create a temporary text file
            const filePath = path.join(__dirname, 'cache', 'espn.txt');
            await fs.writeFile(filePath, matchingLines.join("\n\n"));
  
            // Read the file content
            const data = await fs.readFile(filePath, "utf-8");
  
            // Prepend the date and time string to the data
            const updatedData = `Updated: ${formattedDate}\n\n${data}`;
  
            const { PasteClient } = require('pastebin-api');
            const client = new PasteClient("aeGtA7rxefvTnR3AKmYwG-jxMo598whT");
  
            // Create a paste with the updated data
            const url = await client.createPaste({
              code: updatedData.replace(/#EXTINF:-1 tvg-id="[^"]+" tvg-name="[^"]+" tvg-type="[^"]+" group-title="[^"]+" tvg-logo="[^"]+",/g, ''),
              expireDate: 'N',
              name: args[1] || 'noname',
              publicity: 1
            });
  
            const id = url.split('/')[3];
            const link = 'https://pastebin.com/raw/' + id;
            return api.sendMessage({
                body: `Updated: ${formattedDate}\n${link}`
            }, threadID, () =>
            fs.unlinkSync(filePath), messageID);
          } catch (fileError) {
            console.error("Error handling the temporary text file:", fileError.message);
          }
        } else {
          console.log("No matching lines found.");
        }
      } else {
        // Handle the case where the request was not successful (e.g., non-200 status code)
        console.error(`HTTP request failed with status code: ${response.status}`);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("An error occurred:", error.message);
    }
  };
  