// backend/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../cc_processing.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

const initializeDatabase = () => {
    console.log('Initializing database...');
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
        `, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
            } else {
                console.log('Users table created or already exists');
            }
        });

        // Create transactions table
        db.run(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                merchant_id INTEGER,
                amount REAL NOT NULL,
                status TEXT NOT NULL,
                fraud_flag BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (merchant_id) REFERENCES users(id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating transactions table:', err);
            } else {
                console.log('Transactions table created or already exists');
            }
        });

        // Insert default users (for testing)
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (err) {
                console.error('Error checking users table:', err);
                return;
            }
            if (row.count === 0) {
                const bcrypt = require('bcrypt');
                const saltRounds = 10;

                // Hash passwords for default users
                bcrypt.hash('customer123', saltRounds, (err, hash) => {
                    if (err) {
                        console.error('Error hashing customer password:', err);
                        return;
                    }
                    db.run(
                        'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)',
                        ['customer@example.com', hash, 'customer'],
                        (err) => {
                            if (err) {
                                console.error('Error inserting customer:', err);
                            } else {
                                console.log('Default customer inserted');
                            }
                        }
                    );
                });

                bcrypt.hash('merchant123', saltRounds, (err, hash) => {
                    if (err) {
                        console.error('Error hashing merchant password:', err);
                        return;
                    }
                    db.run(
                        'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)',
                        ['merchant@example.com', hash, 'merchant'],
                        (err) => {
                            if (err) {
                                console.error('Error inserting merchant:', err);
                            } else {
                                console.log('Default merchant inserted');
                            }
                        }
                    );
                });
            } else {
                console.log('Default users already exist');
            }
        });
    });
};

module.exports = { db, initializeDatabase };