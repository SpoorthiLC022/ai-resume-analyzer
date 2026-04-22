const { getDB } = require('../config/db');

class UserModel {
  static async createUser(name, email, hashedPassword) {
    const db = getDB();
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result.insertId;
  }

  static async getUserByEmail(email) {
    const db = getDB();
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async getUserById(id) {
    const db = getDB();
    const [rows] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = UserModel;
