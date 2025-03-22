// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

const authenticate = (req, res, next) => {
    console.log('Authenticating request...');
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = { JWT_SECRET, authenticate };
console.log('Auth middleware loaded');