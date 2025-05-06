// src/services/menuService.js

/**
 * Creates a keyboard menu for Telegram
 * @returns {Object} Keyboard menu configuration
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
   * Creates an inline keyboard menu for Telegram
   * @returns {Object} Inline keyboard menu configuration
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
   * Generates profile information text
   * @param {Object} user - Telegram user object
   * @returns {String} Formatted profile information
   */
  const generateProfileInfo = (user) => {
    const userInfo = {
      nama: user.first_name + (user.last_name ? ' ' + user.last_name : ''),
      username: user.username || 'Tidak ada',
      id: user.id
    };
    
    return `📋 *Informasi Profil*\n\n` +
      `*Nama:* ${userInfo.nama}\n` +
      `*Username:* @${userInfo.username}\n` +
      `*ID Telegram:* ${userInfo.id}`;
  };
  
  /**
   * Generates balance information text
   * @param {Number} saldo - User balance
   * @returns {String} Formatted balance information
   */
  const generateBalanceInfo = (saldo) => {
    return `💰 *Saldo Anda*\n\nSaldo saat ini: Rp ${saldo.toLocaleString('id-ID')}`;
  };
  
  /**
   * Generates topup information text
   * @returns {String} Formatted topup information
   */
  const generateTopupInfo = () => {
    return '💲 *Menu Topup Saldo*\n\n' +
      'Silakan transfer ke rekening berikut:\n\n' +
      'Bank BCA: 1234567890\n' +
      'Atas nama: John Doe\n\n' +
      'Setelah transfer, silakan kirim bukti pembayaran ke admin.';
  };
  
  module.exports = {
    createKeyboardMenu,
    createInlineMenu,
    generateProfileInfo,
    generateBalanceInfo,
    generateTopupInfo
  };