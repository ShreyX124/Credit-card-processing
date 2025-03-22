// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    // Validate password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ msg: 'Server error' });
      }
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          username: user.username,
          userType: user.user_type
        }
      };

      // Sign token
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              userType: user.user_type
            }
          });
        }
      );
    });
  });
});

module.exports = router;