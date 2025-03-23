// routes/transaction.js
const express = require('express');
const { db } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { decrypt } = require('../utils/encryption');

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions (for merchants) or user transactions (for customers)
// @access  Private
router.get('/', authenticate, (req, res) => {
  const userId = req.user.id;
  const userType = req.user.userType;

  // Build query based on user type
  let query, params;
  
  if (userType === 'merchant') {
    // Merchants can only see transactions where they are the merchant
    query = `
      SELECT t.*, u.username as customer_email
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.merchant_id = ?
      ORDER BY t.created_at DESC
    `;
    params = [userId];
  } else {
    // Customers can only see their own transactions
    query = `
      SELECT * FROM transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
    params = [userId];
  }

  db.all(query, params, (err, transactions) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ msg: 'Server error' });
    }

    // Process transactions to mask sensitive data
    const processedTransactions = transactions.map(transaction => {
      // For demonstration purposes, only showing first/last 4 digits of card
      // In a real app, you would decrypt the full number first
      try {
        const decryptedCardNumber = decrypt(transaction.card_number);
        const maskedCardNumber = decryptedCardNumber.replace(/^(\d{4})(\d+)(\d{4})$/, '$1************$3');
        
        return {
          ...transaction,
          card_number: maskedCardNumber,
          // Don't return these sensitive fields
          card_expiry: undefined,
          card_cvv: undefined
        };
      } catch (error) {
        console.error('Decryption error:', error);
        return {
          ...transaction,
          card_number: '****************',
          card_expiry: undefined,
          card_cvv: undefined
        };
      }
    });

    res.json(processedTransactions);
  });
});

module.exports = router;