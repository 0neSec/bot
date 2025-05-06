// api/webhook.js - For Vercel serverless function

const TelegramBot = require('node-telegram-bot-api');

// Replace with your own token obtained from BotFather
const token = '7878181735:AAGwUtDBTQW7VOX9IQBTiIsd1QCHA9kFEAU';

// Create a new bot instance specifically for webhook processing
// The polling option must be FALSE for webhook mode
const bot = new TelegramBot(token, { polling: false });

// Serverless function to handle webhook events
module.exports = async (req, res) => {
  // Only allow POST requests for webhook data
  if (req.method !== 'POST') {
    res.status(200).send('Telegram Bot is active. Send POST requests to this webhook.');
    return;
  }

  try {
    // Process the update from Telegram
    const update = req.body;
    
    // Log incoming updates (will appear in Vercel logs)
    console.log('Received update:', JSON.stringify(update).substring(0, 100) + '...');
    
    // Check if this is a message and process accordingly
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || '';
      
      console.log(`Message from ${msg.from.first_name}: ${text}`);
      
      // Handle /start command
      if (text === '/start') {
        const firstName = msg.from.first_name || 'user';
        
        // Create welcome message
        const welcomeMessage = `Selamat datang ${firstName}! 👋\n\nSilakan pilih menu di bawah ini:`;
        
        // Create keyboard with menu options
        const mainMenu = {
          reply_markup: {
            keyboard: [
              ['📱 Paket XL OTP', '📦 Paket XL'],
              ['👤 Profil', '💰 Saldo'],
              ['💲 Topup', '❓ Bantuan']
            ],
            resize_keyboard: true
          }
        };
        
        // Send welcome message with menu buttons
        await bot.sendMessage(chatId, welcomeMessage, mainMenu);
      }
      // Handle /menu command
      else if (text === '/menu') {
        const mainMenu = {
          reply_markup: {
            keyboard: [
              ['📱 Paket XL OTP', '📦 Paket XL'],
              ['👤 Profil', '💰 Saldo'],
              ['💲 Topup', '❓ Bantuan']
            ],
            resize_keyboard: true
          }
        };
        
        await bot.sendMessage(chatId, 'Silakan pilih menu:', mainMenu);
      }
      // Handle /help command
      else if (text === '/help') {
        await bot.sendMessage(chatId, 
          '❓ *Bantuan*\n\n' +
          '• Untuk memulai bot, kirim /start\n' +
          '• Untuk melihat menu utama, kirim /menu\n' +
          '• Untuk informasi paket, pilih menu Paket XL atau Paket XL OTP\n' +
          '• Untuk topup saldo, pilih menu Topup\n\n' +
          'Butuh bantuan lebih lanjut? Hubungi admin di @admin_username',
          { parse_mode: 'Markdown' }
        );
      }
      // Handle menu button selections
      else if (text === '📱 Paket XL OTP') {
        await bot.sendMessage(chatId, 'Anda memilih menu Paket XL OTP.\nSilakan pilih paket yang tersedia:');
      }
      else if (text === '📦 Paket XL') {
        await bot.sendMessage(chatId, 'Anda memilih menu Paket XL.\nSilakan pilih paket yang tersedia:');
      }
      else if (text === '👤 Profil') {
        const userInfo = {
          nama: msg.from.first_name + (msg.from.last_name ? ' ' + msg.from.last_name : ''),
          username: msg.from.username || 'Tidak ada',
          id: msg.from.id
        };
        
        await bot.sendMessage(chatId, 
          `📋 *Informasi Profil*\n\n` +
          `*Nama:* ${userInfo.nama}\n` +
          `*Username:* @${userInfo.username}\n` +
          `*ID Telegram:* ${userInfo.id}`,
          { parse_mode: 'Markdown' }
        );
      }
      else if (text === '💰 Saldo') {
        // Replace this with actual saldo retrieval logic
        const saldo = 50000; // Example value
        await bot.sendMessage(chatId, 
          `💰 *Saldo Anda*\n\nSaldo saat ini: Rp ${saldo.toLocaleString('id-ID')}`, 
          { parse_mode: 'Markdown' }
        );
      }
      else if (text === '💲 Topup') {
        await bot.sendMessage(chatId, 
          '💲 *Menu Topup Saldo*\n\n' +
          'Silakan transfer ke rekening berikut:\n\n' +
          'Bank BCA: 1234567890\n' +
          'Atas nama: John Doe\n\n' +
          'Setelah transfer, silakan kirim bukti pembayaran ke admin.',
          { parse_mode: 'Markdown' }
        );
      }
      else if (text === '❓ Bantuan') {
        await bot.sendMessage(chatId, 
          '❓ *Bantuan*\n\n' +
          '• Untuk memulai bot, kirim /start\n' +
          '• Untuk melihat menu utama, kirim /menu\n' +
          '• Untuk informasi paket, pilih menu Paket XL atau Paket XL OTP\n' +
          '• Untuk topup saldo, pilih menu Topup\n\n' +
          'Butuh bantuan lebih lanjut? Hubungi admin di @admin_username',
          { parse_mode: 'Markdown' }
        );
      }
      // Echo back messages that aren't button selections or commands
      else if (text && !text.startsWith('/')) {
        await bot.sendMessage(chatId, `Anda mengirim: ${text}`);
      }
    }
    
    // Return a 200 status to acknowledge receipt of the update
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing update:', error);
    res.status(500).send('Error processing update');
  }
};