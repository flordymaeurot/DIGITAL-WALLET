import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export class User {
  static async findByEmail(email: string) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id: string) {
    const result = await pool.query('SELECT id, email, username, first_name, last_name, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(email: string, username: string, password: string, firstName?: string, lastName?: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const passwordHash = await bcrypt.hash(password, 10);
      const userResult = await client.query(
        'INSERT INTO users (email, username, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username',
        [email, username, passwordHash, firstName, lastName]
      );

      const userId = userResult.rows[0].id;

      // Create wallet for the user
      await client.query(
        'INSERT INTO wallets (user_id, balance) VALUES ($1, $2)',
        [userId, 0.00]
      );

      await client.query('COMMIT');

      return userResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async validatePassword(user: any, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
      expiresIn: '24h',
    });
  }
}
