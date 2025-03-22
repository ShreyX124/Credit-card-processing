// backend/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Create a database connection
const db = new sqlite3.Database(
  path.join(__dirname, '../cc_processing.db'),
  (err) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Connected to SQLite database');
    }
  }
);

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
        merchant_id INTEGER, -- Changed to nullable to avoid issues with existing data
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (merchant_id) REFERENCES users (id)
      )
    `);

    // Insert default users for demo within a transaction
    const saltRounds = 10;
    const customerPassword = bcrypt.hashSync('customer123', saltRounds);
    const merchantPassword = bcrypt.hashSync('merchant123', saltRounds);
    const adminPassword = bcrypt.hashSync('admin123', saltRounds);

    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return;
      }

      // Insert customer
      db.get('SELECT * FROM users WHERE username = ?', ['customer@example.com'], (err, row) => {
        if (err) {
          console.error('Error checking customer user:', err);
          db.run('ROLLBACK');
          return;
        }
        if (!row) {
          db.run(
            'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)',
            ['customer@example.com', customerPassword, 'customer'],
            (err) => {
              if (err) console.error('Error inserting customer:', err);
            }
          );
        }
      });

      // Insert merchant
      db.get('SELECT * FROM users WHERE username = ?', ['merchant@example.com'], (err, row) => {
        if (err) {
          console.error('Error checking merchant user:', err);
          db.run('ROLLBACK');
          return;
        }
        if (!row) {
          db.run(
            'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)',
            ['merchant@example.com', merchantPassword, 'merchant'],
            (err) => {
              if (err) console.error('Error inserting merchant:', err);
            }
          );
        }
      });

      // Insert admin
      db.get('SELECT * FROM users WHERE username = ?', ['admin@example.com'], (err, row) => {
        if (err) {
          console.error('Error checking admin user:', err);
          db.run('ROLLBACK');
          return;
        }
        if (!row) {
          db.run(
            'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)',
            ['admin@example.com', adminPassword, 'admin'],
            (err) => {
              if (err) console.error('Error inserting admin:', err);
            }
          );
        }
      });

      db.run('COMMIT', (err) => {
        if (err) {
          console.error('Error committing transaction:', err);
          db.run('ROLLBACK');
        } else {
          console.log('Demo users initialized successfully');
        }
      });
    });
  });
};

module.exports = {
  db,
  initializeDatabase
};