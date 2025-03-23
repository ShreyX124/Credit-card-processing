// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { JWT_SECRET, authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    console.log('Register endpoint called with:', req.body);
    const { username, password, userType } = req.body;

    if (!username || !password || !userType) {
        console.log('Missing fields:', { username, password, userType });
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (!['customer', 'merchant'].includes(userType)) {
        console.log('Invalid user type:', userType);
        return res.status(400).json({ msg: 'Invalid user type' });
    }

    try {
        // Check if user already exists
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err) {
                console.error('Database error while checking user:', err);
                return res.status(500).json({ msg: 'Server error' });
            }
            if (user) {
                console.log('User already exists:', username);
                return res.status(400).json({ msg: 'User already exists' });
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log('Password hashed successfully');

            // Insert the new user into the database
            db.run(
                'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)',
                [username, hashedPassword, userType],
                function (err) {
                    if (err) {
                        console.error('Error inserting user into database:', err);
                        return res.status(500).json({ msg: 'Error creating user' });
                    }

                    const userId = this.lastID;
                    console.log('User inserted with ID:', userId);

                    const payload = {
                        user: {
                            id: userId,
                            username,
                            userType
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
                                return res.status(500).json({ msg: 'Error signing token' });
                            }
                            console.log('Token generated successfully');
                            res.json({
                                token,
                                user: {
                                    id: userId,
                                    username,
                                    userType
                                }
                            });
                        }
                    );
                }
            );
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
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

// @route   GET /api/auth/profile
// @desc    Get user profile and transactions
// @access  Private
router.get('/profile', authenticate, (req, res) => {
    const userId = req.user.id;
    const userType = req.user.userType;
    console.log('Fetching profile for user:', { userId, userType });

    // Fetch user data
    db.get('SELECT id, username, user_type FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Database error fetching user:', err);
            return res.status(500).json({ msg: 'Database error' });
        }
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ msg: 'User not found' });
        }

        // Fetch transactions based on user type
        let query;
        if (userType === 'merchant') {
            query = 'SELECT * FROM transactions WHERE merchant_id = ?';
        } else {
            query = 'SELECT * FROM transactions WHERE user_id = ?';
        }
        console.log('Executing query:', query, 'with userId:', userId);

        db.all(query, [userId], (err, transactions) => {
            if (err) {
                console.error('Database error fetching transactions:', err);
                return res.status(500).json({ msg: 'Database error' });
            }
            console.log('Transactions fetched:', transactions);
            res.json({ user, transactions });
        });
    });
});

module.exports = router;