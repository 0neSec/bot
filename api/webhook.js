// api/webhook.js - For Vercel serverless function

const TelegramBot = require('node-telegram-bot-api');

// Replace with your own token obtained from BotFather
const token = '7878181735:AAGwUtDBTQW7VOX9IQBTiIsd1QCHA9kFEAU';

// Create bot instance
const bot = new TelegramBot(token);

// Handle /start command with menu buttons
bot.onText(/\/start/, (msg) => {
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
  bot.sendMessage(chatId, welcomeMessage, keyboardMenu);
  
  // Send menu message with inline buttons
  bot.sendMessage(chatId, '📋 *Menu Utama*:', {
    parse_mode: 'Markdown',
    ...inlineMenu
  });
});

// Handle inline button callbacks
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  
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
      bot.sendMessage(chatId, 
        '❓ *Bantuan*\n\n' +
        '• Untuk memulai bot, kirim /start\n' +
        '• Untuk melihat menu utama, kirim /menu\n' +
        '• Untuk informasi paket, pilih menu Paket XL atau Paket XL OTP\n' +
        '• Untuk topup saldo, pilih menu Topup\n\n' +
        'Butuh bantuan lebih lanjut? Hubungi admin di @admin_username',
        { parse_mode: 'Markdown' }
      );
      break;
  }
  
  // Always answer callback query to remove loading state
  bot.answerCallbackQuery(callbackQuery.id);
});

// Handle menu button selections (from keyboard buttons)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  
  // Skip command messages (they have their own handlers)
  if (messageText && messageText.startsWith('/')) {
    return;
  }
  
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
      bot.sendMessage(chatId, 
        '❓ *Bantuan*\n\n' +
        '• Untuk memulai bot, kirim /start\n' +
        '• Untuk melihat menu utama, kirim /menu\n' +
        '• Untuk informasi paket, pilih menu Paket XL atau Paket XL OTP\n' +
        '• Untuk topup saldo, pilih menu Topup\n\n' +
        'Butuh bantuan lebih lanjut? Hubungi admin di @admin_username',
        { parse_mode: 'Markdown' }
      );
      break;
      
    default:
      // Echo back messages that aren't button selections
      if (messageText) {
        bot.sendMessage(chatId, `Anda mengirim: ${messageText}`);
      }
      break;
  }
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    '❓ *Bantuan*\n\n' +
    '• Untuk memulai bot, kirim /start\n' +
    '• Untuk melihat menu utama, kirim /menu\n' +
    '• Untuk informasi paket, pilih menu Paket XL atau Paket XL OTP\n' +
    '• Untuk topup saldo, pilih menu Topup\n\n' +
    'Butuh bantuan lebih lanjut? Hubungi admin di @admin_username',
    { parse_mode: 'Markdown' }
  );
});

// Add /menu command to show both menus again
bot.onText(/\/menu/, (msg) => {
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
  bot.sendMessage(chatId, 'Silakan pilih menu:', keyboardMenu);
  bot.sendMessage(chatId, '📋 *Menu Utama*:', {
    parse_mode: 'Markdown',
    ...inlineMenu
  });
});

// This is the main handler function for Vercel
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(200).send('Telegram Bot is active. Use POST for webhook.');
    return;
  }

  try {
    // Process the update from Telegram
    const update = req.body;
    
    // Log incoming messages (will appear in Vercel logs)
    if (update.message && update.message.text) {
      console.log(`Received message from ${update.message.from.first_name}: ${update.message.text}`);
    }
    
    // Process all updates through the bot
    await bot.processUpdate(update);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing update:', error);
    res.status(500).send('Error processing update');
  }
};