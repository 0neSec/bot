// src/controllers/menuController.js
const { bot } = require('../config/botConfig');
const menuService = require('../services/menuService');
const { logError } = require('../utils/messageUtils');

/**
 * Handle /menu command
 */
const handleMenu = (msg) => {
  try {
    const chatId = msg.chat.id;
    
    // Get keyboard menu
    const keyboardMenu = menuService.createKeyboardMenu();
    
    // Get inline menu
    const inlineMenu = menuService.createInlineMenu();
    
    // Send both menus
    bot.sendMessage(chatId, 'Silakan pilih menu:', keyboardMenu)
      .then(() => {
        return bot.sendMessage(chatId, '📋 *Menu Utama*:', {
          parse_mode: 'Markdown',
          ...inlineMenu
        });
      })
      .catch(error => {
        logError('handleMenu', error);
      });
  } catch (error) {
    logError('handleMenu', error);
  }
};

module.exports = handleMenu;