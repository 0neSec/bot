// index.js - Improved script to set up the webhook
const axios = require('axios');

// Your bot token
const token = '7878181735:AAGwUtDBTQW7VOX9IQBTiIsd1QCHA9kFEAU';

// Your Vercel deployment URL (without trailing slash)
const url = 'https://bot-fawn-two.vercel.app';

async function setWebhook() {
  try {
    // First check if webhook is already set
    const getWebhookInfoResponse = await axios.get(
      `https://api.telegram.org/bot${token}/getWebhookInfo`
    );
    
    console.log('Current webhook info:', getWebhookInfoResponse.data);
    
    // Set the webhook
    const response = await axios.get(
      `https://api.telegram.org/bot${token}/setWebhook?url=${url}/api/webhook&max_connections=100&drop_pending_updates=true`
    );
    
    console.log('Webhook set response:', response.data);
    
    // Verify webhook was set correctly
    const verifyResponse = await axios.get(
      `https://api.telegram.org/bot${token}/getWebhookInfo`
    );
    
    console.log('Webhook verification:', verifyResponse.data);
    
    // Test sending a message to yourself (replace with your chat ID)
    // You can get your chat ID by sending a message to @userinfobot on Telegram
    const yourChatId = "YOUR_CHAT_ID"; // Replace with your actual chat ID
    if (yourChatId !== "YOUR_CHAT_ID") {
      const testMessageResponse = await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: yourChatId,
          text: "Webhook setup complete! Bot should be operational now."
        }
      );
      console.log('Test message sent:', testMessageResponse.data);
    } else {
      console.log('Skipping test message. Replace YOUR_CHAT_ID with your actual chat ID to test.');
    }
  } catch (error) {
    console.error('Error:', error.response ? JSON.stringify(error.response.data) : error.message);
  }
}

// Execute the function
setWebhook();