// src/controllers/botController.js
const { bot, helpMessageContent } = require('../config/botConfig');
const menuService = require('../services/menuService');
const { logMessage, createWelcomeMessage, logError, getUserBalance } = require('../utils/messageUtils');

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

/**
 * Handle callback queries from inline buttons
 */
const handleCallbackQuery = (callbackQuery) => {
  try {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    
    logMessage('callback query', data, chatId);
    
    // Handle different callback data
    switch (data) {
      case 'paket_xl_otp':
        bot.sendMessage(chatId, 'Anda memilih menu Paket XL OTP.\nSilakan pilih paket yang tersedia:');
        break;
        
      case 'paket_xl':
        bot.sendMessage(chatId, 'Anda memilih menu Paket XL.\nSilakan pilih paket yang tersedia:');
        break;
        
      case 'profil':
        const profileInfo = menuService.generateProfileInfo(callbackQuery.from);
        bot.sendMessage(chatId, profileInfo, { parse_mode: 'Markdown' });
        break;
        
      case 'saldo':
        const saldo = getUserBalance();
        const balanceInfo = menuService.generateBalanceInfo(saldo);
        bot.sendMessage(chatId, balanceInfo, { parse_mode: 'Markdown' });
        break;
        
      case 'topup':
        const topupInfo = menuService.generateTopupInfo();
        bot.sendMessage(chatId, topupInfo, { parse_mode: 'Markdown' });
        break;
        
      case 'bantuan':
        bot.sendMessage(chatId, helpMessageContent, { parse_mode: 'Markdown' })
          .then(() => {
            console.log('Bantuan message sent successfully via callback');
          })
          .catch(error => {
            logError('handleCallbackQuery - bantuan', error);
          });
        break;
      
      default:
        bot.sendMessage(chatId, 'Opsi tidak dikenal.');
        break;
    }
    
    // Always answer callback query to remove loading state
    bot.answerCallbackQuery(callbackQuery.id)
      .catch(error => {
        logError('handleCallbackQuery - answerCallbackQuery', error);
      });
  } catch (error) {
    logError('handleCallbackQuery', error);
    try {
      bot.answerCallbackQuery(callbackQuery.id).catch(e => logError('Could not answer callback query', e));
    } catch (e) {
      logError('Error in error handler', e);
    }
  }
};

/**
 * Handle regular text messages
 */
const handleMessage = (msg) => {
  try {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    
    // Skip command messages (they have their own handlers)
    if (messageText && messageText.startsWith('/')) {
      return;
    }
    
    logMessage('message', messageText, chatId);
    
    // Handle button selections
    switch (messageText) {
      case '📱 Paket XL OTP':
        bot.sendMessage(chatId, 'Anda memilih menu Paket XL OTP.\nSilakan pilih paket yang tersedia:');
        break;
        
      case '📦 Paket XL':
        bot.sendMessage(chatId, 'Anda memilih menu Paket XL.\nSilakan pilih paket yang tersedia:');
        break;
        
      case '👤 Profil':
        const profileInfo = menuService.generateProfileInfo(msg.from);
        bot.sendMessage(chatId, profileInfo, { parse_mode: 'Markdown' });
        break;
        
      case '💰 Saldo':
        const saldo = getUserBalance();
        const balanceInfo = menuService.generateBalanceInfo(saldo);
        bot.sendMessage(chatId, balanceInfo, { parse_mode: 'Markdown' });
        break;
        
      case '💲 Topup':
        const topupInfo = menuService.generateTopupInfo();
        bot.sendMessage(chatId, topupInfo, { parse_mode: 'Markdown' });
        break;
        
      case '❓ Bantuan':
        bot.sendMessage(chatId, helpMessageContent, { parse_mode: 'Markdown' })
          .then(() => {
            console.log('Bantuan message sent successfully via keyboard');
          })
          .catch(error => {
            logError('handleMessage - bantuan', error);
          });
        break;
        
      default:
        // Echo back messages that aren't button selections
        if (messageText) {
          bot.sendMessage(chatId, `Anda mengirim: ${messageText}`);
        }
        break;
    }
  } catch (error) {
    logError('handleMessage', error);
  }
};

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

/**
 * Setup all bot handlers
 */
const setupBotHandlers = () => {
  // Register command handlers
  bot.onText(/\/start/, handleStart);
  bot.onText(/\/help/, handleHelp);
  bot.onText(/\/menu/, handleMenu);
  
  // Register callback query handler
  bot.on('callback_query', handleCallbackQuery);
  
  // Register message handler
  bot.on('message', handleMessage);
  
  // Special test command
  bot.onText(/\/bantuan/, (msg) => {
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
  });
};

module.exports = {
  setupBotHandlers,
  handleStart,
  handleCallbackQuery,
  handleMessage,
  handleHelp,
  handleMenu
};