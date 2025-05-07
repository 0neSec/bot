// src/controllers/helpController.js
const { bot, helpMessageContent } = require('../config/botConfig');
const { logError } = require('../utils/messageUtils');

/**
 * Handle /help command
 */
const handleHelp = (msg) => {
  try {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, helpMessageContent, { parse_mode: 'Markdown' })
      .then(() => {
        console.log('Help message sent successfully');
      })
      .catch(error => {
        logError('handleHelp', error);
      });
  } catch (error) {
    logError('handleHelp', error);
  }
};

module.exports = handleHelp;