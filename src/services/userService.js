// src/services/userService.js
const { User } = require('../models');
const { logError } = require('../utils/messageUtils');

/**
 * Find user by Telegram ID
 * @param {string} telegramId - Telegram user ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserByTelegramId = async (telegramId) => {
  try {
    const user = await User.findOne({
      where: { telegram_id: telegramId }
    });
    return user;
  } catch (error) {
    logError('findUserByTelegramId', error);
    return null;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object|null>} Created user or null on error
 */
const createUser = async (userData) => {
  try {
    const user = await User.create({
      telegram_id: userData.telegramId,
      name: userData.name,
      role: userData.role || 0,
      saldo: userData.saldo || 0.00
    });
    return user;
  } catch (error) {
    logError('createUser', error);
    return null;
  }
};

/**
 * Update user balance
 * @param {string} telegramId - Telegram user ID
 * @param {number} amount - Amount to add (positive) or subtract (negative)
 * @returns {Promise<Object|null>} Updated user or null on error
 */
const updateUserBalance = async (telegramId, amount) => {
  try {
    const user = await findUserByTelegramId(telegramId);
    if (!user) return null;

    const newBalance = parseFloat(user.saldo) + parseFloat(amount);
    if (newBalance < 0) return null; // Prevent negative balance

    user.saldo = newBalance;
    await user.save();
    return user;
  } catch (error) {
    logError('updateUserBalance', error);
    return null;
  }
};

/**
 * Update user role
 * @param {string} telegramId - Telegram user ID
 * @param {number} role - New role (0: User, 1: Admin, 2: Reseller)
 * @returns {Promise<Object|null>} Updated user or null on error
 */
const updateUserRole = async (telegramId, role) => {
  try {
    const user = await findUserByTelegramId(telegramId);
    if (!user) return null;

    user.role = role;
    await user.save();
    return user;
  } catch (error) {
    logError('updateUserRole', error);
    return null;
  }
};

/**
 * Get all users
 * @returns {Promise<Array|null>} Array of users or null on error
 */
const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    logError('getAllUsers', error);
    return null;
  }
};

/**
 * Check if user is admin
 * @param {string} telegramId - Telegram user ID
 * @returns {Promise<boolean>} True if user is admin, false otherwise
 */
const isAdmin = async (telegramId) => {
  try {
    const user = await findUserByTelegramId(telegramId);
    return user && user.role === 1;
  } catch (error) {
    logError('isAdmin', error);
    return false;
  }
};

/**
 * Check if user is reseller
 * @param {string} telegramId - Telegram user ID
 * @returns {Promise<boolean>} True if user is reseller, false otherwise
 */
const isReseller = async (telegramId) => {
  try {
    const user = await findUserByTelegramId(telegramId);
    return user && user.role === 2;
  } catch (error) {
    logError('isReseller', error);
    return false;
  }
};

/**
 * Delete user by Telegram ID
 * @param {string} telegramId - Telegram user ID
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
const deleteUser = async (telegramId) => {
  try {
    const result = await User.destroy({
      where: { telegram_id: telegramId }
    });
    return result > 0;
  } catch (error) {
    logError('deleteUser', error);
    return false;
  }
};

module.exports = {
  findUserByTelegramId,
  createUser,
  updateUserBalance,
  updateUserRole,
  getAllUsers,
  isAdmin,
  isReseller,
  deleteUser
};