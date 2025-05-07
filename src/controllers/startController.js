// src/controllers/startController.js
const { bot } = require('../config/botConfig');
const menuService = require('../services/menuService');
const { logMessage, createWelcomeMessage, logError } = require('../utils/messageUtils');
const { User } = require('../models');

/**
 * Handle /start command
 * Creates a new user if they don't exist and sends welcome message
 */
const handleStart = async (msg) => {
  try {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const firstName = msg.from.first_name || 'user';
    
    // Create or find user
    try {
      const [user, created] = await User.findOrCreate({
        where: { telegram_id: telegramId },
        defaults: {
          name: firstName,
          role: 0, // Default role
          saldo: 0.00 // Default balance
        }
      });
      
      if (created) {
        console.log(`New user created: ${firstName} (${telegramId})`);
      } else {
        console.log(`Existing user: ${user.name} (${telegramId})`);
      }
    } catch (dbError) {
      logError('handleStart - Database Error', dbError);
    }
    
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

module.exports = handleStart;