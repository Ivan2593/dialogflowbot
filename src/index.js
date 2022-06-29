const TelegramBot = require('node-telegram-bot-api');
let token = '5329719192:AAEN02Venqldpu4hNm_RsyWfOWZUWbPVV_0';
let bot = new TelegramBot(token, { polling: true });
const intents = require('./intents.js');


bot.on('message', (msg) => {
    intents.intent("myproject-349220", "12", msg, "ru").then(r =>  {bot.sendMessage(msg.chat.id, r)});
});