// api/webhook.js - For Vercel serverless function

const TelegramBot = require('node-telegram-bot-api');

// Replace with your own token obtained from BotFather
const token = '7878181735:AAGwUtDBTQW7VOX9IQBTiIsd1QCHA9kFEAU';

// Create bot instance
const bot = new TelegramBot(token);

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Telegram bot! I will echo back your messages. Try sending me something.');
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Available commands:\n/start - Start the bot\n/help - Show this help message');
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
      
      // Handle commands
      if (update.message.text.startsWith('/')) {
        // Let the bot command handlers process this
        await bot.processUpdate(update);
      } else {
        // Echo for non-command messages
        await bot.sendMessage(update.message.chat.id, `You said: ${update.message.text}`);
      }
    } else {
      // Process other types of updates
      await bot.processUpdate(update);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing update:', error);
    res.status(500).send('Error processing update');
  }
};