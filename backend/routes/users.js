// backend/routes/users.js
const express = require('express');
const { db } = require('../config/database');

const router = express.Router();

// @route   GET /api/users/merchants
// @desc    Get list of merchants
// @access  Public (or Private, depending on your requirements)
router.get('/merchants', (req, res) => {
    db.all('SELECT id, username FROM users WHERE user_type = ?', ['merchant'], (err, merchants) => {
        if (err) {
            console.error('Database error fetching merchants:', err);
            return res.status(500).json({ msg: 'Server error' });
        }
        res.json(merchants);
    });
});

module.exports = router;