// src/controllers/startController.js
const { bot } = require('../config/botConfig');
const menuService = require('../services/menuService');
const { createWelcomeMessage, logError } = require('../utils/messageUtils');

/**
 * Handle /start command
 */
const handleStart = (msg) => {
  try {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'user';
    
    // Create welcome message
    const welcomeMessage = createWelcomeMessage(firstName);
    
    // Get keyboard menu
    const keyboardMenu = menuService.createKeyboardMenu();
    
    // Get inline menu
    const inlineMenu = menuService.createInlineMenu();
    
    // Send welcome message with keyboard buttons
    bot.sendMessage(chatId, welcomeMessage, keyboardMenu)
      .then(() => {
        // Send menu message with inline buttons
        return bot.sendMessage(chatId, '📋 *Menu Utama*:', {
          parse_mode: 'Markdown',
          ...inlineMenu
        });
      })
      .catch(error => {
        logError('handleStart', error);
      });
  } catch (error) {
    logError('handleStart', error);
  }
};

module.exports = {
  handleStart
};