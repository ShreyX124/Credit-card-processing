// backend/config/config.js
module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/credit-card-app',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here'
  };