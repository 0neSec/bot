// src/controllers/index.js
const { bot } = require('../config/botConfig');
const { handleStart } = require('./startController');
const { handleCallbackQuery } = require('./callbackController');
const { handleMessage } = require('./messageController');
const { handleHelp, handleBantuanTest } = require('./helpController');
const { handleMenu } = require('./menuController');

/**
 * Setup all bot handlers
 */
const setupBotHandlers = () => {
  // Register command handlers
  bot.onText(/\/start/, handleStart);
  bot.onText(/\/help/, handleHelp);
  bot.onText(/\/menu/, handleMenu);
  bot.onText(/\/bantuan/, handleBantuanTest);
  
  // Register callback query handler
  bot.on('callback_query', handleCallbackQuery);
  
  // Register message handler
  bot.on('message', handleMessage);
};

module.exports = {
  setupBotHandlers,
  handleStart,
  handleCallbackQuery,
  handleMessage,
  handleHelp,
  handleMenu
};