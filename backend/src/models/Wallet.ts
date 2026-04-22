import pool from '../config/database';

export class Wallet {
  static async findByUserId(userId: string) {
    const result = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
    return result.rows[0];
  }

  static async getBalance(userId: string): Promise<number> {
    const wallet = await this.findByUserId(userId);
    return wallet ? parseFloat(wallet.balance) : 0;
  }

  static async updateBalance(userId: string, amount: number) {
    const result = await pool.query(
      'UPDATE wallets SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING balance',
      [amount, userId]
    );
    return result.rows[0];
  }
}
