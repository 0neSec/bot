// src/utils/messageUtils.js

/**
 * Logs message information for debugging purposes
 * @param {String} type - Type of message
 * @param {String} content - Message content
 * @param {Number} chatId - Telegram chat ID
 */
const logMessage = (type, content, chatId) => {
    console.log(`Received ${type}: ${content} from chat ID: ${chatId}`);
  };
  
  /**
   * Creates a welcome message with user's first name
   * @param {String} firstName - User's first name
   * @returns {String} Formatted welcome message
   */
  const createWelcomeMessage = (firstName) => {
    return `Selamat datang ${firstName}! 👋\n\nSilakan pilih menu di bawah ini:`;
  };
  
  /**
   * Logs errors with additional context
   * @param {String} context - Where the error occurred
   * @param {Error} error - The error object
   */
  const logError = (context, error) => {
    console.error(`Error in ${context}:`, error);
  };
  
  /**
   * Gets dummy balance (to be replaced with database logic)
   * @returns {Number} User balance
   */
  const getUserBalance = () => {
    // Replace this with actual saldo retrieval logic
    return 50000; // Example value
  };
  
  module.exports = {
    logMessage,
    createWelcomeMessage,
    logError,
    getUserBalance
  };