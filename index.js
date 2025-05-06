// setWebhook.js - One-time script to set up the webhook
const axios = require('axios');

// Your bot token
const token = '7878181735:AAGwUtDBTQW7VOX9IQBTiIsd1QCHA9kFEAU';

// Your Vercel deployment URL (without trailing slash)
const url = 'https://bot-sigma-amber.vercel.app';
const webhookPath = '/api/webhook';

async function setWebhook() {
  try {
    // First, check if webhook is already set
    const getWebhookInfo = await axios.get(
      `https://api.telegram.org/bot${token}/getWebhookInfo`
    );
    
    console.log('Current webhook info:', getWebhookInfo.data);
    
    // Set the new webhook
    const response = await axios.get(
      `https://api.telegram.org/bot${token}/setWebhook`,
      {
        params: {
          url: `${url}${webhookPath}`,
          drop_pending_updates: true, // Optional: drop any pending updates
          allowed_updates: JSON.stringify(["message", "callback_query"]) // Only process these update types
        }
      }
    );
    
    console.log('Webhook set response:', response.data);
    
    // Verify the webhook was set correctly
    const verifyWebhook = await axios.get(
      `https://api.telegram.org/bot${token}/getWebhookInfo`
    );
    
    console.log('Verified webhook info:', verifyWebhook.data);
  } catch (error) {
    console.error('Error setting webhook:', error.response ? error.response.data : error.message);
  }
}

setWebhook();