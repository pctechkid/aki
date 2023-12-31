module.exports.config = {
  name: "brainly",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Aki Hayakawa",
  description: "Searches for a brainly answers",
  usePrefix: true,
  commandCategory: "ai",
  cooldowns: 5,
  usage: "[query]",
};

module.exports.run = async function({
  api,
  args,
  event
}) {
  const axios = require("axios");
  const query = args.join(" ").replace(/<br\s*\/?>/g, "");
  const {
      threadID
  } = event;

  if (!query) {
      return api.sendMessage("Please provide a query to search.", threadID);
  }

  try {
      const response = await axios.get(
          `https://forgivegod.lazygreyzz.repl.co/api/other/search1?query=${encodeURIComponent(
    query
  )}&language=ph`
      );

      const results = response.data;

      if (results.length === 0) {
          api.sendMessage("No results found for the query.", threadID);
          return;
      }

      let message = "Here are the search results:\n\n";
      results.forEach((result, index) => {
          const cleanQuestion = result.question.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags from question
          message += `${index + 1}. ${cleanQuestion}\n`;
      });

      message += "\nPlease reply with the number of the question you want to view the answer to.";

      api.sendMessage(message, threadID, async (error, info) => {
          if (error) {
              console.error("An error occurred:", error);
              return;
          }


          global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              results: results,
          });
      });
  } catch (error) {
      console.error("An error occurred:", error);
      api.sendMessage("An error occurred while fetching the search results.", threadID);
  }
};

module.exports.handleReply = async function({
  api,
  event,
  handleReply
}) {
  const {
      threadID,
      messageID,
      body
  } = event;
  const {
      author,
      results
  } = handleReply;


  if (author !== handleReply.author) {
      return;
  }


  const selectedQuestionIndex = parseInt(body);
  if (isNaN(selectedQuestionIndex) || selectedQuestionIndex < 1 || selectedQuestionIndex > results.length) {
      api.sendMessage("Please reply with a valid number corresponding to the question.", threadID);
      return;
  }

  const selectedQuestion = results[selectedQuestionIndex - 1];
  const cleanAnswer = selectedQuestion.answer
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\\[tex\\]/g, "")
      .replace(/\\[\/tex\\]/g, "")
      .replace(/\\[^\s]+/g, "");

  const response = `Question: ${selectedQuestion.question}\n\nAnswer: ${cleanAnswer}`;
  api.sendMessage(response, threadID);
  const index = global.client.handleReply.findIndex((entry) => entry.messageID === messageID);
  if (index !== -1) {
      global.client.handleReply.splice(index, 1);
  }
};