// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', (req, res) => {
  const { username, password, userType } = req.body;

  console.log('Register request received:', { username, password, userType });

  // Validate input
  if (!username || !password || !userType) {
    console.log('Validation failed: Missing fields');
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (!['customer', 'merchant'].includes(userType)) {
    console.log('Validation failed: Invalid userType');
    return res.status(400).json({ msg: 'Invalid user type' });
  }

  // Check for existing user
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Database error checking user:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
    if (user) {
      console.log('User already exists:', username);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      console.log('Inserting user:', { username, userType });
      // Insert new user
      db.run(
        'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)',
        [username, hashedPassword, userType],
        function (err) {
          if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ msg: 'Server error' });
          }

          console.log('User inserted successfully, ID:', this.lastID);

          const payload = {
            user: {
              id: this.lastID,
              username: username,
              userType: userType
            }
          };

          // Sign token
          jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
              if (err) {
                console.error('Error signing token:', err);
                throw err;
              }
              console.log('Registration successful:', username);
              res.json({
                token,
                user: {
                  id: this.lastID,
                  username: username,
                  userType: userType
                }
              });
            }
          );
        }
      );
    });
  });
});

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