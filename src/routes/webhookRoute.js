// src/routes/webhookRoute.js
const { bot } = require('../config/botConfig');

/**
 * Handle webhook request from Telegram
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const handleWebhook = async (req, res) => {
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

module.exports = {
  handleWebhook
};