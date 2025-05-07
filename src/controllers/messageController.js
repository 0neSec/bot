// src/controllers/messageController.js
const { bot, helpMessageContent } = require('../config/botConfig');
const menuService = require('../services/menuService');
const { logMessage, logError, getUserBalance } = require('../utils/messageUtils');

/**
 * Handle regular text messages
 */
const handleMessage = async (msg) => {
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
        const telegramId = msg.from.id.toString();
        const userService = require('../services/userService');
        
        try {
          const saldo = await userService.getUserBalance(telegramId);
          const balanceInfo = menuService.generateBalanceInfo(saldo);
          bot.sendMessage(chatId, balanceInfo, { parse_mode: 'Markdown' });
        } catch (error) {
          logError('handleMessage - saldo', error);
          bot.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengambil saldo Anda.');
        }
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

module.exports = handleMessage;