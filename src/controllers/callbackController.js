// src/controllers/callbackController.js
const { bot, helpMessageContent } = require('../config/botConfig');
const menuService = require('../services/menuService');
const { logMessage, logError, getUserBalance } = require('../utils/messageUtils');

/**
 * Handle callback queries from inline buttons
 */
const handleCallbackQuery = async (callbackQuery) => {
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
        const telegramId = callbackQuery.from.id.toString();
        const userService = require('../services/userService');
        
        try {
          const saldo = await userService.getUserBalance(telegramId);
          const balanceInfo = menuService.generateBalanceInfo(saldo);
          bot.sendMessage(chatId, balanceInfo, { parse_mode: 'Markdown' });
        } catch (error) {
          logError('handleCallbackQuery - saldo', error);
          bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengambil saldo Anda.');
        }
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

module.exports = handleCallbackQuery;