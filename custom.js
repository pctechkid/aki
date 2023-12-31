module.exports = async ({ api }) => {
  const logger = require('./utils/log');
  const cron = require('node-cron');
  const fs = require('fs');
  const axios = require ('axios');
  const yandeva = {
    autoRestart: {
      status: true,
      time: 30, //40 minutes
      note: 'To avoid problems, enable periodic bot restarts'
    },
    acceptPending: {
      status: false,
      time: 30, //30 minutes
      note: 'Approve waiting messages after a certain time'
    }
  }
  function autoRestart(config) {
    if (config.status) {
      setInterval(async () => {
        logger(`Rebooting system!`, "Auto Restart")
        process.exit(1)
      }, config.time * 60 * 1000)
    }
  }
  function acceptPending(config) {
    if (config.status) {
      setInterval(async () => {
        const list = [
          ...(await api.getThreadList(1, null, ['PENDING'])),
          ...(await api.getThreadList(1, null, ['OTHER']))
        ];
        if (list[0]) {
          api.sendMessage('You have been approved for the queue. (This is an automated message)', list[0].threadID);
        }
      }, config.time * 60 * 1000)
    }
  }
  autoRestart(yandeva.autoRestart)
  acceptPending(yandeva.acceptPending)

    cron.schedule('0 7 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nGood morning!\nTime check: 7:00 AM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('30 8 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nTime check: 8:30 AM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 10 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nWhat's your plan for today?\nTime check: 10:00 AM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('30 10 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nWanna talk with me?\nTime check: 10:30 AM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 11 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nLunch is almost there.\nTime check: 11:00 AM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 12 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nTime for lunch!\nTime check: 12:00 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 15 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nGood afternoon!\nTime check: 3:00 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 16 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nTime check: 4:00 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 18 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nGood evening!\nTime check: 6:00 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 19 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nDinner time!\nTime check: 7:00 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 20 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nHow's your evening?\nTime check: 8:00 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 21 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nTime check: 9:00 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 22 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nTime check: 10:00 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 23 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nTime check: 11:00 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('30 23 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nTime check: 11:30 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('45 23 * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          const getQuote = await axios.get(`https://api.quotable.io/random`);
          const quote = getQuote.data.content;
          const author = getQuote.data.author;

          api.sendMessage(`"${quote}"\n— ${author}\n\nGood night!\nTime check: 11:45 PM`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });
  
};
