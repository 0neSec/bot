// api/webhook.js - For Vercel serverless function
const { setupBotHandlers } = require('../src/controllers/index');
const { handleWebhook } = require('../src/routes/webhookRoute');

// Initialize bot handlers
setupBotHandlers();

// Export the webhook handler for Vercel
module.exports = handleWebhook;