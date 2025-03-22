// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Create a database connection
const db = new sqlite3.Database(path.join(__dirname, '../cc_processing.db'));

// Initialize database and create tables
const initializeDatabase = () => {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        user_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        card_number TEXT NOT NULL,
        card_expiry TEXT NOT NULL,
        card_cvv TEXT NOT NULL,
        status TEXT NOT NULL,
        fraud_flag BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Insert default users for demo
    const saltRounds = 10;
    const customerPassword = bcrypt.hashSync('customer123', saltRounds);
    const merchantPassword = bcrypt.hashSync('merchant123', saltRounds);

    db.get('SELECT * FROM users WHERE username = ?', ['customer@example.com'], (err, row) => {
      if (!row) {
        db.run('INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)', 
          ['customer@example.com', customerPassword, 'customer']);
      }
    });

    db.get('SELECT * FROM users WHERE username = ?', ['merchant@example.com'], (err, row) => {
      if (!row) {
        db.run('INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)', 
          ['merchant@example.com', merchantPassword, 'merchant']);
      }
    });
  });
};

module.exports = {
  db,
  initializeDatabase
};