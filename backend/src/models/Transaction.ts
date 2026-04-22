import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';

export class Transaction {
  static async recordTransaction(
    walletId: string,
    amount: number,
    type: string,
    senderId?: string,
    receiverId?: string,
    description?: string
  ) {
    const result = await pool.query(
      `INSERT INTO transactions (id, wallet_id, amount, transaction_type, sender_id, receiver_id, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [uuidv4(), walletId, amount, type, senderId, receiverId, description, 'completed']
    );
    return result.rows[0];
  }

  static async getTransactionsByUserId(userId: string, limit: number = 50, offset: number = 0) {
    const result = await pool.query(
      `SELECT * FROM transactions 
       WHERE sender_id = $1 OR receiver_id = $1 OR wallet_id IN (
         SELECT id FROM wallets WHERE user_id = $1
       )
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async getTransactionCount(userId: string): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM transactions 
       WHERE sender_id = $1 OR receiver_id = $1 OR wallet_id IN (
         SELECT id FROM wallets WHERE user_id = $1
       )`,
      [userId]
    );
    return parseInt(result.rows[0].count);
  }
}
