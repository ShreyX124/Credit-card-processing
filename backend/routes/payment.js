// routes/payment.js
const express = require('express');
const { db } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { encrypt } = require('../utils/encryption');

const router = express.Router();

// Helper function to check for fraudulent transactions
const checkFraud = (amount, userId) => {
  return new Promise((resolve) => {
    // Rule 1: Amount over $1000
    if (amount > 1000) {
      return resolve({ 
        isFraudulent: true, 
        reason: 'Transaction amount exceeds $1000' 
      });
    }

    // Rule 2: Repeated transactions in last minute
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    
    db.get(
      'SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND created_at > datetime(?)',
      [userId, oneMinuteAgo],
      (err, result) => {
        if (err || !result) {
          return resolve({ isFraudulent: false });
        }
        
        if (result.count > 0) {
          return resolve({ 
            isFraudulent: true, 
            reason: 'Multiple transactions detected within 1 minute' 
          });
        }
        
        resolve({ isFraudulent: false });
      }
    );
  });
};

// Mock payment gateway function
const processPaymentGateway = () => {
  // Simulate payment gateway with 90% success rate
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccessful = Math.random() < 0.9;
      resolve({
        success: isSuccessful,
        transactionId: isSuccessful ? `tr_${Date.now()}` : null,
        message: isSuccessful ? 'Payment processed successfully' : 'Payment failed'
      });
    }, 500); // Simulate network delay
  });
};

// Helper function to promisify db.get
const getMerchant = (merchantId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM users WHERE id = ? AND user_type = ?', [merchantId, 'merchant'], (err, merchant) => {
      if (err) {
        return reject(err);
      }
      resolve(merchant);
    });
  });
};

// @route   POST /api/payment/process
// @desc    Process a payment
// @access  Private (Customer only)
router.post('/process', authenticate, async (req, res) => {
  const { amount, cardNumber, expiry, cvv, merchantId } = req.body;
  const userId = req.user.id;

  if (!amount || !cardNumber || !expiry || !cvv || !merchantId) {
    return res.status(400).json({ msg: 'Please enter all fields, including merchant ID' });
  }

  try {
    // Verify that the merchant exists
    const merchant = await getMerchant(merchantId);
    if (!merchant) {
      return res.status(400).json({ msg: 'Invalid merchant ID' });
    }

    // Check for fraud
    const fraudCheck = await checkFraud(amount, userId);
    
    // Process payment through gateway
    const paymentResult = await processPaymentGateway();
    
    // Determine final status
    let status = 'failed';
    if (paymentResult.success) {
      status = fraudCheck.isFraudulent ? 'flagged' : 'completed';
    }

    // Encrypt sensitive data
    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedCardExpiry = encrypt(expiry);
    const encryptedCardCvv = encrypt(cvv);

    // Save transaction
    db.run(
      `INSERT INTO transactions 
      (user_id, merchant_id, amount, card_number, card_expiry, card_cvv, status, fraud_flag) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        merchantId,
        amount, 
        encryptedCardNumber, 
        encryptedCardExpiry, 
        encryptedCardCvv, 
        status, 
        fraudCheck.isFraudulent ? 1 : 0
      ],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ msg: 'Failed to save transaction' });
        }

        res.json({
          success: status === 'completed',
          status,
          transactionId: this.lastID,
          fraudDetected: fraudCheck.isFraudulent,
          fraudReason: fraudCheck.isFraudulent ? fraudCheck.reason : null,
          message: paymentResult.message
        });
      }
    );
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;