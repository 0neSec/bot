// src/services/menuService.js
const userService = require('./userService');

/**
 * Create keyboard menu
 * @returns {Object} Keyboard menu options
 */
const createKeyboardMenu = () => {
  return {
    reply_markup: {
      keyboard: [
        ['📱 Paket XL OTP', '📦 Paket XL'],
        ['👤 Profil', '💰 Saldo'],
        ['💲 Topup', '❓ Bantuan']
      ],
      resize_keyboard: true
    }
  };
};

/**
 * Create inline menu
 * @returns {Object} Inline menu options
 */
const createInlineMenu = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📱 Paket XL OTP', callback_data: 'paket_xl_otp' },
          { text: '📦 Paket XL', callback_data: 'paket_xl' }
        ],
        [
          { text: '👤 Profil', callback_data: 'profil' },
          { text: '💰 Saldo', callback_data: 'saldo' }
        ],
        [
          { text: '💲 Topup', callback_data: 'topup' },
          { text: '❓ Bantuan', callback_data: 'bantuan' }
        ]
      ]
    }
  };
};

/**
 * Generate profile information text
 * @param {Object} user - Telegram user object
 * @returns {string} Profile information text
 */
const generateProfileInfo = async (user) => {
  try {
    const telegramId = user.id.toString();
    const dbUser = await userService.findUserByTelegramId(telegramId);
    
    let role = 'Pengguna';
    if (dbUser && dbUser.role === 1) {
      role = 'Admin';
    } else if (dbUser && dbUser.role === 2) {
      role = 'Reseller';
    }
    
    return `*Informasi Profil*\n\n` +
      `*ID*: \`${user.id}\`\n` +
      `*Nama*: ${user.first_name || ''} ${user.last_name || ''}\n` +
      `*Username*: ${user.username ? '@' + user.username : 'Tidak ada'}\n` +
      `*Role*: ${role}\n` +
      `*Saldo*: Rp ${dbUser ? parseFloat(dbUser.saldo).toLocaleString('id-ID') : '0'}`;
  } catch (error) {
    console.error('Error generating profile info:', error);
    return `*Informasi Profil*\n\n` +
      `*ID*: \`${user.id}\`\n` +
      `*Nama*: ${user.first_name || ''} ${user.last_name || ''}\n` +
      `*Username*: ${user.username ? '@' + user.username : 'Tidak ada'}\n` +
      `*Role*: Pengguna\n` +
      `*Saldo*: Rp 0`;
  }
};

/**
 * Generate balance information text
 * @param {number} balance - User balance
 * @returns {string} Balance information text
 */
const generateBalanceInfo = (balance) => {
  return `*Informasi Saldo*\n\n` +
    `Saldo Anda saat ini: *Rp ${parseFloat(balance).toLocaleString('id-ID')}*\n\n` +
    `Untuk menambah saldo, silakan gunakan menu Topup.`;
};

/**
 * Generate topup information text
 * @returns {string} Topup information text
 */
const generateTopupInfo = () => {
  return `*Cara Topup Saldo*\n\n` +
    `1. Transfer ke rekening berikut:\n` +
    `   Bank BCA: 1234567890\n` +
    `   Atas Nama: XL OTP Service\n\n` +
    `2. Kirim bukti transfer ke admin:\n` +
    `   @admin_xl_otp\n\n` +
    `3. Saldo akan ditambahkan setelah verifikasi.`;
};

module.exports = {
  createKeyboardMenu,
  createInlineMenu,
  generateProfileInfo,
  generateBalanceInfo,
  generateTopupInfo
};