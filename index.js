// Import required packages
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config(); // For loading environment variables

// Get token from environment variables for security
const token = process.env.TELEGRAM_BOT_TOKEN;
const port = process.env.PORT || 3000;
const url = process.env.APP_URL || 'https://bot-sigma-amber.vercel.app';

// Validate environment variables
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN environment variable is not set!');
  process.exit(1);
}

// Create Express app
const app = express();
app.use(express.json());

// Create Telegram bot instance
const bot = new TelegramBot(token);

// Set webhook for production
bot.setWebHook(`${url}/bot${token}`);
console.log(`Webhook set to: ${url}/bot${token}`);

// Store user sessions (for more complex interactions)
const userSessions = {};

// Handle different message types
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  
  // Log incoming messages
  console.log(`Received message from ${msg.from.first_name} (${chatId}): ${msg.text}`);
  
  try {
    // Check if it's a command
    if (msg.text && msg.text.startsWith('/')) {
      // Command handling is done separately via onText handlers
      return;
    }
    
    // Handle different message types
    if (msg.photo) {
      await bot.sendMessage(chatId, 'Nice photo! 📸');
    } else if (msg.voice) {
      await bot.sendMessage(chatId, 'I received your voice message! 🎤');
    } else if (msg.document) {
      await bot.sendMessage(chatId, `I received your file: ${msg.document.file_name || 'unnamed file'} 📄`);
    } else if (msg.sticker) {
      await bot.sendMessage(chatId, 'Cool sticker! 🌟');
    } else if (msg.text) {
      // Echo the message
      await bot.sendMessage(chatId, `You said: ${msg.text}`);
    } else {
      await bot.sendMessage(chatId, 'I received your message but I\'m not sure how to process it.');
    }
  } catch (error) {
    console.error(`Error handling message: ${error.message}`);
    await bot.sendMessage(chatId, 'Sorry, there was an error processing your message.');
  }
});

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  
  try {
    await bot.sendMessage(
      chatId, 
      `Welcome ${firstName} to the Telegram bot! 🎉\n\nI will echo back your messages and can handle various types of content. Try sending me something or use /help to see available commands.`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error(`Error in /start command: ${error.message}`);
  }
});

// Handle /help command
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(
      chatId, 
      `*Available Commands:*\n
/start - Start the bot
/help - Show this help message
/about - Learn about this bot
/time - Get current server time

You can also send me messages, photos, stickers, voice notes, or files and I'll respond accordingly.`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error(`Error in /help command: ${error.message}`);
  }
});

// Handle /about command
bot.onText(/\/about/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(
      chatId, 
      'This is a demo Telegram bot built with Node.js and Express. It demonstrates basic bot functionality including webhook handling and message processing.',
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error(`Error in /about command: ${error.message}`);
  }
});

// Handle /time command
bot.onText(/\/time/, async (msg) => {
  const chatId = msg.chat.id;
  const currentTime = new Date().toLocaleString();
  
  try {
    await bot.sendMessage(chatId, `The current server time is: ${currentTime}`);
  } catch (error) {
    console.error(`Error in /time command: ${error.message}`);
  }
});

// Set up Express server routes
app.get('/', (req, res) => {
  res.send('Telegram Bot Server is running! 🤖');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Process webhook requests
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Catch-all for other routes
app.use((req, res) => {
  res.status(404).send('Not found');
});

// Start the server
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
  console.log(`Telegram bot is running in webhook mode at ${url}/bot${token}`);
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// Webhook error handling
bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error);
});

// Polling error handling (if you switch to polling mode)
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Bot shutting down...');
  // Optionally, you could remove the webhook before shutting down
  try {
    await bot.deleteWebHook();
    console.log('Webhook deleted successfully');
  } catch (error) {
    console.error('Error deleting webhook:', error);
  }
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});