// api/webhook.js - For Vercel serverless function

const TelegramBot = require('node-telegram-bot-api');

// Replace with your own token obtained from BotFather
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

// Handle /start command with menu buttons
bot.onText(/\/start/, (msg) => {
  try {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'user';
    
    // Create welcome message
    const welcomeMessage = `Selamat datang ${firstName}! 👋\n\nSilakan pilih menu di bawah ini:`;
    
    // Create keyboard menu (appears as custom keyboard)
    const keyboardMenu = {
      reply_markup: {
        keyboard: [
          ['📱 Paket XL OTP', '📦 Paket XL'],
          ['👤 Profil', '💰 Saldo'],
          ['💲 Topup', '❓ Bantuan']
        ],
        resize_keyboard: true
      }
    };
    
    // Create inline keyboard menu (appears in the message itself)
    const inlineMenu = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📱 Paket XL OTP', callback_data: 'paket_xl_otp' },
            { text: '📦 Paket XL', callback_data: 'paket_xl' }
          ],
          [
            { text: '👤 Profil', callback_data: 'profil' },
            { text: '💰 Saldo', callback_data: 'saldo' }
          ],
          [
            { text: '💲 Topup', callback_data: 'topup' },
            { text: '❓ Bantuan', callback_data: 'bantuan' }
          ]
        ]
      }
    };
    
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
        console.error('Error in /start handler:', error);
      });
  } catch (error) {
    console.error('Error in /start handler:', error);
  }
});

// Handle inline button callbacks
bot.on('callback_query', (callbackQuery) => {
  try {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    
    console.log(`Received callback query: ${data} from chat ID: ${chatId}`);
    
    // Handle different callback data
    switch (data) {
      case 'paket_xl_otp':
        bot.sendMessage(chatId, 'Anda memilih menu Paket XL OTP.\nSilakan pilih paket yang tersedia:');
        // Here you would add the specific XL OTP package options
        break;
        
      case 'paket_xl':
        bot.sendMessage(chatId, 'Anda memilih menu Paket XL.\nSilakan pilih paket yang tersedia:');
        // Here you would add the specific XL package options
        break;
        
      case 'profil':
        const userInfo = {
          nama: callbackQuery.from.first_name + (callbackQuery.from.last_name ? ' ' + callbackQuery.from.last_name : ''),
          username: callbackQuery.from.username || 'Tidak ada',
          id: callbackQuery.from.id
        };
        
        bot.sendMessage(chatId, 
          `📋 *Informasi Profil*\n\n` +
          `*Nama:* ${userInfo.nama}\n` +
          `*Username:* @${userInfo.username}\n` +
          `*ID Telegram:* ${userInfo.id}`,
          { parse_mode: 'Markdown' }
        );
        break;
        
      case 'saldo':
        // Replace this with actual saldo retrieval logic
        const saldo = 50000; // Example value
        bot.sendMessage(chatId, `💰 *Saldo Anda*\n\nSaldo saat ini: Rp ${saldo.toLocaleString('id-ID')}`, { parse_mode: 'Markdown' });
        break;
        
      case 'topup':
        bot.sendMessage(chatId, 
          '💲 *Menu Topup Saldo*\n\n' +
          'Silakan transfer ke rekening berikut:\n\n' +
          'Bank BCA: 1234567890\n' +
          'Atas nama: John Doe\n\n' +
          'Setelah transfer, silakan kirim bukti pembayaran ke admin.',
          { parse_mode: 'Markdown' }
        );
        break;
        
      case 'bantuan':
        bot.sendMessage(chatId, helpMessageContent, { parse_mode: 'Markdown' })
          .then(() => {
            console.log('Bantuan message sent successfully via callback');
          })
          .catch(error => {
            console.error('Error sending bantuan message via callback:', error);
          });
        break;
      
      default:
        bot.sendMessage(chatId, 'Opsi tidak dikenal.');
        break;
    }
    
    // Always answer callback query to remove loading state
    bot.answerCallbackQuery(callbackQuery.id)
      .catch(error => {
        console.error('Error answering callback query:', error);
      });
  } catch (error) {
    console.error('Error in callback_query handler:', error);
    try {
      bot.answerCallbackQuery(callbackQuery.id).catch(e => console.error('Could not answer callback query:', e));
    } catch (e) {
      console.error('Error in error handler:', e);
    }
  }
});

// Handle menu button selections (from keyboard buttons)
bot.on('message', (msg) => {
  try {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    
    // Skip command messages (they have their own handlers)
    if (messageText && messageText.startsWith('/')) {
      return;
    }
    
    console.log(`Received message: ${messageText} from chat ID: ${chatId}`);
    
    // Handle button selections
    switch (messageText) {
      case '📱 Paket XL OTP':
        bot.sendMessage(chatId, 'Anda memilih menu Paket XL OTP.\nSilakan pilih paket yang tersedia:');
        // Here you would add the specific XL OTP package options
        break;
        
      case '📦 Paket XL':
        bot.sendMessage(chatId, 'Anda memilih menu Paket XL.\nSilakan pilih paket yang tersedia:');
        // Here you would add the specific XL package options
        break;
        
      case '👤 Profil':
        const userInfo = {
          nama: msg.from.first_name + (msg.from.last_name ? ' ' + msg.from.last_name : ''),
          username: msg.from.username || 'Tidak ada',
          id: msg.from.id
        };
        
        bot.sendMessage(chatId, 
          `📋 *Informasi Profil*\n\n` +
          `*Nama:* ${userInfo.nama}\n` +
          `*Username:* @${userInfo.username}\n` +
          `*ID Telegram:* ${userInfo.id}`,
          { parse_mode: 'Markdown' }
        );
        break;
        
      case '💰 Saldo':
        // Replace this with actual saldo retrieval logic
        const saldo = 50000; // Example value
        bot.sendMessage(chatId, `💰 *Saldo Anda*\n\nSaldo saat ini: Rp ${saldo.toLocaleString('id-ID')}`, { parse_mode: 'Markdown' });
        break;
        
      case '💲 Topup':
        bot.sendMessage(chatId, 
          '💲 *Menu Topup Saldo*\n\n' +
          'Silakan transfer ke rekening berikut:\n\n' +
          'Bank BCA: 1234567890\n' +
          'Atas nama: John Doe\n\n' +
          'Setelah transfer, silakan kirim bukti pembayaran ke admin.',
          { parse_mode: 'Markdown' }
        );
        break;
        
      case '❓ Bantuan':
        bot.sendMessage(chatId, helpMessageContent, { parse_mode: 'Markdown' })
          .then(() => {
            console.log('Bantuan message sent successfully via keyboard');
          })
          .catch(error => {
            console.error('Error sending bantuan message via keyboard:', error);
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
    console.error('Error in message handler:', error);
  }
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  try {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, helpMessageContent, { parse_mode: 'Markdown' })
      .then(() => {
        console.log('Help message sent successfully');
      })
      .catch(error => {
        console.error('Error sending help message:', error);
      });
  } catch (error) {
    console.error('Error in /help handler:', error);
  }
});

// Add /menu command to show both menus again
bot.onText(/\/menu/, (msg) => {
  try {
    const chatId = msg.chat.id;
    
    // Create keyboard menu
    const keyboardMenu = {
      reply_markup: {
        keyboard: [
          ['📱 Paket XL OTP', '📦 Paket XL'],
          ['👤 Profil', '💰 Saldo'],
          ['💲 Topup', '❓ Bantuan']
        ],
        resize_keyboard: true
      }
    };
    
    // Create inline keyboard menu
    const inlineMenu = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📱 Paket XL OTP', callback_data: 'paket_xl_otp' },
            { text: '📦 Paket XL', callback_data: 'paket_xl' }
          ],
          [
            { text: '👤 Profil', callback_data: 'profil' },
            { text: '💰 Saldo', callback_data: 'saldo' }
          ],
          [
            { text: '💲 Topup', callback_data: 'topup' },
            { text: '❓ Bantuan', callback_data: 'bantuan' }
          ]
        ]
      }
    };
    
    // Send both menus
    bot.sendMessage(chatId, 'Silakan pilih menu:', keyboardMenu)
      .then(() => {
        return bot.sendMessage(chatId, '📋 *Menu Utama*:', {
          parse_mode: 'Markdown',
          ...inlineMenu
        });
      })
      .catch(error => {
        console.error('Error in /menu handler:', error);
      });
  } catch (error) {
    console.error('Error in /menu handler:', error);
  }
});

// Special command to test help functionality
bot.onText(/\/testbantuan/, (msg) => {
  try {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Testing bantuan functionality...');
    bot.sendMessage(chatId, helpMessageContent, { parse_mode: 'Markdown' })
      .then(() => {
        console.log('Test bantuan message sent successfully');
      })
      .catch(error => {
        console.error('Error sending test bantuan message:', error);
      });
  } catch (error) {
    console.error('Error in /testbantuan handler:', error);
  }
});

// This is the main handler function for Vercel
module.exports = async (req, res) => {
  // Only allow POST requests for actual webhook handling
  if (req.method !== 'POST') {
    res.status(200).send('Telegram Bot is active. Use POST for webhook.');
    return;
  }

  try {
    // Process the update from Telegram
    const update = req.body;
    
    // Log incoming updates for debugging
    console.log('Received update:', JSON.stringify(update).substring(0, 200) + '...');
    
    // Process all updates through the bot
    await bot.processUpdate(update);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing update:', error);
    res.status(500).send('Error processing update');
  }
};