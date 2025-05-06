// index.js - For Vercel root route
module.exports = (req, res) => {
  res.status(200).send('Telegram Bot Server is running! The webhook endpoint is at /api/webhook');
};

// setWebhook.js - One-time script to set up the webhook
const axios = require('axios');

// Your bot token
const token = '7878181735:AAGwUtDBTQW7VOX9IQBTiIsd1QCHA9kFEAU';

// Your Vercel deployment URL (without trailing slash)
const url = 'https://bot-fawn-two.vercel.app';

async function setWebhook() {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${token}/setWebhook?url=${url}/api/webhook`
    );
    console.log('Webhook set response:', response.data);
  } catch (error) {
    console.error('Error setting webhook:', error.response ? error.response.data : error.message);
  }
}

setWebhook();
