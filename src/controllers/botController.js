// src/controllers/botController.js
const { bot } = require('../config/botConfig');
const handleStart = require('./startController');
const handleHelp = require('./helpController');
const handleMenu = require('./menuController');
const handleCallbackQuery = require('./callbackController');
const handleMessage = require('./messageController');
const handleTestBantuan = require('./testBantuanController');

/**
 * Setup all bot handlers
 */
const setupBotHandlers = () => {
  // Register command handlers
  bot.onText(/\/start/, handleStart);
  bot.onText(/\/help/, handleHelp);
  bot.onText(/\/menu/, handleMenu);
  bot.onText(/\/bantuan/, handleTestBantuan);
  
  // Register callback query handler
  bot.on('callback_query', handleCallbackQuery);
  
  // Register message handler
  bot.on('message', handleMessage);
};

module.exports = {
  setupBotHandlers
};