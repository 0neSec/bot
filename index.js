// Import required packages
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// Replace with your own token obtained from BotFather
const token = '7878181735:AAGwUtDBTQW7VOX9IQBTiIsd1QCHA9kFEAU';
const port = process.env.PORT || 3000;

// Create Express app
const app = express();
app.use(express.json());

// Set up the Telegram bot
// For production, use webhook instead of polling
const bot = new TelegramBot(token, { 
  // Remove polling for production
  // polling: true 
});

// Set webhook URL - replace with your actual hosting URL
const url = process.env.APP_URL || 'https://bot-sigma-amber.vercel.app';
bot.setWebHook(`${url}/bot${token}`);

// Handle different message types
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  // Log incoming messages
  console.log(`Received message from ${msg.from.first_name}: ${msg.text}`);
  
  // Check if it's a command
  if (msg.text && msg.text.startsWith('/')) {
    // Command handling is done separately
    return;
  }
  
  // Basic echo response
  bot.sendMessage(chatId, `You said: ${msg.text}`);
});

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

// Set up Express server
app.get('/', (req, res) => {
  res.send('Telegram Bot Server is running!');
});

// Process webhook requests - ENABLE THIS FOR PRODUCTION
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
  console.log('Telegram bot is running in webhook mode...');
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Bot shutting down...');
  process.exit(0);
});