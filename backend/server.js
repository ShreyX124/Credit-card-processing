// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
let authRoutes;
try {
    authRoutes = require('./routes/auth');
    console.log('Auth routes loaded successfully');
} catch (err) {
    console.error('Error loading auth routes:', err);
    authRoutes = express.Router(); // Fallback to empty router
}
const paymentRoutes = require('./routes/payment');
const transactionRoutes = require('./routes/transaction');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Database
initializeDatabase();

// Routes
console.log('Mounting auth routes...');
app.use('/api/auth', authRoutes);
console.log('Auth routes mounted');

app.use('/api/payment', paymentRoutes);
app.use('/api/transactions', transactionRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Credit Card Processing API is running');
});

// Catch-all route for debugging
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    res.status(404).json({ msg: `Cannot ${req.method} ${req.url}` });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});