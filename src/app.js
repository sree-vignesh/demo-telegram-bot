require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TOKEN;
let url = `https://www.rajalakshmi.org/QRCode/img/`;
let url2 = `.jpg`;
// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true,
});

// In-memory storage
const URLs = [];
const URLLabels = [];
let tempSiteURL = "";
/*
bot.onText(/\/idp (.+)/, (msg, match) => {
  const rno = match[1];
  //bot.sendMessage(msg.chat.id, "helo");
  console.log(`${url}` + rno + `${url2}`);
  bot.sendPhoto(msg.chat.id, `${url}` + rno + `${url2}`);
});
*/
//bot.onText()
bot.on("text", (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  console.log(resp);
  bot.sendMessage(chatId, resp);
});
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  console.log(resp);

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});
bot.onText(/\/aad/, (msg) => {
  bot.sendDocument(msg.chat.id, "/home/vicky/Downloads/aad.pdf");
});
bot.onText(/\/tc1/, (msg) => {
  bot.sendPhoto(
    msg.chat.id,
    "https://wallup.net/wp-content/uploads/2018/03/23/566310-sky-landscape-road-sunset.jpg"
  );
  console.log(msg);
});
/*bot.onText(/\/repeat/, (msg, match) => {
  const resp = match[1];
  bot.sendMessage(msg.chat.id, resp);
});*/
// Listener (handler) for telegram's /bookmark event
bot.onText(/\/bookmark/, (msg, match) => {
  const chatId = msg.chat.id;
  const url = match.input.split(" ")[1];
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  if (url === undefined) {
    bot.sendMessage(chatId, "Please provide URL of article!");
    return;
  }

  URLs.push(url);
  bot.sendMessage(chatId, "URL has been successfully saved!");
});

// Listener (handler) for telegram's /label event
bot.onText(/\/label/, (msg, match) => {
  const chatId = msg.chat.id;
  const url = match.input.split(" ")[1];

  if (url === undefined) {
    bot.sendMessage(chatId, "Please provide URL of article!");
    return;
  }

  tempSiteURL = url;
  bot.sendMessage(chatId, "URL has been successfully saved!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Development",
            callback_data: "development",
          },
          {
            text: "Lifestyle",
            callback_data: "lifestyle",
          },
          {
            text: "Other",
            callback_data: "other",
          },
        ],
      ],
    },
  });
});

// Listener (handler) for callback data from /label command
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const category = callbackQuery.data;

  URLLabels.push({
    url: tempSiteURL,
    label: category,
  });

  tempSiteURL = "";

  bot.sendMessage(
    message.chat.id,
    `URL has been labeled with category "${category}"`
  );
});

// Listener (handler) for showcasing different keyboard layout
bot.onText(/\/keyboard/, (msg) => {
  bot.sendMessage(msg.chat.id, "Alternative keybaord layout", {
    reply_markup: {
      keyboard: [["/aad"], ["Csbs"], ["/echo helo"], ["Go back"]],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true,
    },
  });
});

// Inline keyboard options
const inlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "YES",
          callback_data: JSON.stringify({
            command: "mycommand1",
            answer: "YES",
          }),
        },
        {
          text: "NO",
          callback_data: JSON.stringify({
            command: "mycommand1",
            answer: "NO",
          }),
        },
      ],
    ],
  },
};

// Listener (handler) for showcasing inline keyboard layout
bot.onText(/\/inline/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "You have to agree with me, OK?",
    inlineKeyboard
  );
});

// Keyboard layout for requesting phone number access
const requestPhoneKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: "My phone number",
          request_contact: true,
          one_time_keyboard: true,
        },
      ],
      ["Cancel"],
    ],
  },
};

// Listener (handler) for retrieving phone number
bot.onText(/\/phone/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Can we get access to your phone number?",
    requestPhoneKeyboard
  );
});

// Handler for phone number request when user gives permission
bot.on("contact", async (msg) => {
  const phone = msg.contact.phone_number;
  bot.sendMessage(msg.chat.id, `Phone number saved: ${phone}`);
});
// Listener (handler) for telegram's /start event
// This event happened when you start the conversation with both by the very first time
// Provide the list of available commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `
            Welcome at <b>ArticleBot</b>, thank you for using my service
      
            Available commands:
        
            /bookmark <b>URL</b> - save interesting article URL
        `,
    {
      parse_mode: "HTML",
    }
  );
});
