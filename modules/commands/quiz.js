module.exports.config = {
  name: "quiz",
  version: "1.0",
  hasPermission: 0,
  credits: "Aki Hayakawa",
  usePrefix: true,
  description: "Answer trivia questions",
  commandCategory: "Fun",
  cooldowns: 5,
};

const axios = require('axios');
const triviaData = {};

const difficultyMap = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

const categoryMap = {
  general: 9,
  book: 10,
  books: 10,
  film: 11,
  music: 12,
  theatre: 13,
  theatres: 13,
  television: 14,
  videogame: 15,
  videogames: 15,
  boardgame: 16,
  boardgames: 16,
  science: 17,
  computer: 18,
  computers: 18,
  math: 19,
  mythology: 20,
  sport: 21,
  sports: 21,
  geography: 22,
  history: 23,
  politic: 24,
  politics: 24,
  art: 25,
  celebrity: 26,
  celebrities: 26,
  animal: 27,
  animals: 27,
  vehicle: 28,
  vehicles: 28,
  comic: 29,
  comics: 29,
  gadget: 30,
  gadgets: 30,
  anime: 31,
  cartoon: 32,
};

function getFirstName(fullName) {
  let names = fullName.split(' ');
  return names[0] || fullName;
}

// Function to fetch the user's name based on senderID
async function getUserName(api, senderID) {
  const userInfo = await api.getUserInfo(senderID);
  let user1 = userInfo[senderID].name;
  if (user1) {
    let user = getFirstName(user1);
    return user;
  } else {
    return "Unknown User"; // Return a default name if the user's name is not available
  }
}

// Create a function to reveal the answer
function revealAnswer(api, threadID) {
  if (!triviaData[threadID].answered) {
    const { correctIndex, options } = triviaData[threadID];
    const correctLetter = String.fromCharCode(65 + correctIndex);
    api.sendMessage(`Time's up! The correct answer is:\n\n${correctLetter}. ${decodeURIComponent(options[correctIndex])}`, threadID);
    triviaData[threadID].answered = true;
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  // Clear previous trivia data for this thread
  if (triviaData[threadID]) {
    delete triviaData[threadID];
  }

  try {
    // Parse user input for difficulty and category
    const [difficultyInput, categoryInput] = args.map(arg => arg.toLowerCase());
    const difficulty = difficultyMap[difficultyInput] || ''; // Randomize if not recognized
    const category = categoryMap[categoryInput] || ''; // Default to empty string if not recognized

    if (args[0] == 'help'){
      return api.sendMessage(`Welcome to Aki's Quiz!\n\nDifficulties:\n\neasy\nmedium\nhard\n\nCategories:\n\ngeneral\nbooks\nfilm\nmusic\ntheatres\ntelevision\nvideogames\nboardgames\nscience\ncomputers\nmath\nmythology\nsports\ngeography\nhistory\npolitics\nart\ncelebrity\nanimals\nvehicles\ncomics\ngadgets\nanime\ncartoon\n\nUsage:\n${global.config.PREFIX}quiz [difficulty] [category]\n\nExample:\n${global.config.PREFIX}quiz medium math`, threadID, messageID);
    }

    const response = await axios.get(`https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986&difficulty=${difficulty}&category=${category}`);
    const question = response.data.results[0];

    const displayCategory = question.category;
    const displayDifficulty = question.difficulty;

    const options = [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5);
    const optionsString = options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join('\n');

    const questionMessage = `Difficulty: ${capitalizeFirstLetter(decodeURIComponent(displayDifficulty))}\nCategory: ${decodeURIComponent(displayCategory).replace(/\bEntertainment: \b/g, '').replace(/\Science: \b/g, '')}\n\n${decodeURIComponent(question.question)}\n\n${decodeURIComponent(optionsString)}`;
    api.sendMessage(questionMessage, threadID);

    triviaData[threadID] = {
      correctIndex: options.indexOf(question.correct_answer),
      answered: false,
      options: options, // Store the options for this question
    };

    // Set a timeout to reveal the answer after 20 seconds
    const timeout = setTimeout(() => {
      revealAnswer(api, threadID);
    }, 30000); // 30000 milliseconds (30 seconds)

    // Reset the timer after every new question
    triviaData[threadID].timeout = timeout;

    api.listenMqtt((_, message) => {
      if (message.body && /^[a-d]$/.test(message.body.toLowerCase()) && !triviaData[threadID].answered) {
        const userAnswer = message.body.toLowerCase();
        const { correctIndex, options } = triviaData[threadID];

        const correctLetter = String.fromCharCode(65 + correctIndex).toLowerCase(); // Normalize the correct answer letter to lowercase

        if (userAnswer === correctLetter) {
          clearTimeout(triviaData[threadID].timeout);

          // Get the sender's name
          getUserName(api, message.senderID)
            .then(senderName => {
              api.sendMessage({
                body: `${senderName}, you are correct! The answer is:\n\n${userAnswer.toUpperCase()}. ${decodeURIComponent(options[correctIndex])}`,
                mentions: [{
                  tag: senderName,
                  id: message.senderID
                }]
              }, threadID, message.messageID);
            })
            .catch(error => {
              console.error("Error fetching user's name:", error);
            });
        } else {
          clearTimeout(triviaData[threadID].timeout);

          // Get the sender's name
          getUserName(api, message.senderID)
            .then(senderName => {
              api.sendMessage({
                body: `Sorry, ${senderName}. Your answer is wrong. The correct answer is:\n\n${String.fromCharCode(65 + correctIndex)}. ${decodeURIComponent(options[correctIndex])}`,
                mentions: [{
                  tag: senderName,
                  id: message.senderID
                }]
              }, threadID, message.messageID);
            })
            .catch(error => {
              console.error("Error fetching user's name:", error);
            });
        }

        triviaData[threadID].answered = true;
      }
    });
    
  } catch (error) {
    console.error("Error fetching trivia question:", error);
    api.sendMessage("An error occurred while fetching the trivia question.", threadID);
  }
};
