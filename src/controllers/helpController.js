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

/**
 * Handle /bantuan command (special test command)
 */
const handleBantuanTest = (msg) => {
  try {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Testing bantuan functionality...');
    bot.sendMessage(chatId, helpMessageContent, { parse_mode: 'Markdown' })
      .then(() => {
        console.log('Test bantuan message sent successfully');
      })
      .catch(error => {
        logError('testbantuan', error);
      });
  } catch (error) {
    logError('testbantuan', error);
  }
};

module.exports = {
  handleHelp,
  handleBantuanTest
};