const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
    }

    async initialize() {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, '../database/app.db');
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        return new Promise((resolve, reject) => {
            const createUserTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL
                )
            `;

            this.db.run(createUserTable, (err) => {
                if (err) {
                    console.error('Error creating users table:', err);
                    reject(err);
                } else {
                    console.log('Users table created or already exists');
                    resolve();
                }
            });
        });
    }

    async getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM users', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getUserById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async createUser(username, email) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO users (username, email) VALUES (?, ?)',
                [username, email],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            username: username,
                            email: email
                        });
                    }
                }
            );
        });
    }

    async updateUser(id, username, email) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE users SET username = ?, email = ? WHERE id = ?',
                [username, email, id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: id,
                            username: username,
                            email: email
                        });
                    }
                }
            );
        });
    }

    async deleteUser(id) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deletedRows: this.changes });
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed');
                }
            });
        }
    }
}

module.exports = new Database();

