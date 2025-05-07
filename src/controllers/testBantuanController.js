// src/controllers/testBantuanController.js
const { bot, helpMessageContent } = require('../config/botConfig');
const { logError } = require('../utils/messageUtils');

/**
 * Handle special /bantuan command for testing
 */
const handleTestBantuan = (msg) => {
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

module.exports = handleTestBantuan;