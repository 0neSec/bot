// src/config/botConfig.js
const TelegramBot = require('node-telegram-bot-api');

// Bot configuration
const token = '7878181735:AAGwUtDBTQW7VOX9IQBTiIsd1QCHA9kFEAU';

// Create bot instance with polling disabled (we're using webhooks)
const bot = new TelegramBot(token, { polling: false });

// Define help message content for reuse
const helpMessageContent = 
  '❓ *Bantuan*\n\n' +
  '• Untuk memulai bot, kirim /start\n' +
  '• Untuk melihat menu utama, kirim /menu\n' +
  '• Untuk informasi paket, pilih menu Paket XL atau Paket XL OTP\n' +
  '• Untuk topup saldo, pilih menu Topup\n\n' +
  'Butuh bantuan lebih lanjut? Hubungi admin di @admin_username';

module.exports = {
  bot,
  token,
  helpMessageContent
};