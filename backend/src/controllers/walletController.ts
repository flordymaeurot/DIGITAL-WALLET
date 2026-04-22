import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import pool from '../config/database';

export async function getWallet(req: AuthenticatedRequest, res: Response) {
  try {
    const wallet = await Wallet.findByUserId(req.userId!);

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({
      wallet: {
        id: wallet.id,
        balance: parseFloat(wallet.balance),
        currency: wallet.currency,
        createdAt: wallet.created_at,
      },
    });
  } catch (error: any) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch wallet' });
  }
}

export async function cashIn(req: AuthenticatedRequest, res: Response) {
  const client = await pool.connect();
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    await client.query('BEGIN');

    const wallet = await client.query('SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE', [req.userId!]);

    if (!wallet.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Update wallet balance
    await client.query('UPDATE wallets SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2', [amount, req.userId!]);

    // Record transaction
    const transaction = await client.query(
      `INSERT INTO transactions (wallet_id, amount, transaction_type, description, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [wallet.rows[0].id, amount, 'CASH_IN', description || 'Cash-in', 'completed']
    );

    await client.query('COMMIT');

    res.json({
      message: 'Cash-in successful',
      transaction: transaction.rows[0],
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Cash-in error:', error);
    res.status(500).json({ error: error.message || 'Cash-in failed' });
  } finally {
    client.release();
  }
}

export async function sendMoney(req: AuthenticatedRequest, res: Response) {
  const client = await pool.connect();
  try {
    const { receiverEmail, amount, description } = req.body;

    if (!receiverEmail || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid receiver or amount' });
    }

    await client.query('BEGIN');

    // Get sender's wallet (with lock)
    const senderWallet = await client.query(
      'SELECT w.*, u.id as user_id FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.id = $1 FOR UPDATE',
      [req.userId!]
    );

    if (!senderWallet.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Sender wallet not found' });
    }

    // Get receiver
    const receiverResult = await client.query('SELECT id FROM users WHERE email = $1', [receiverEmail]);

    if (!receiverResult.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const receiverId = receiverResult.rows[0].id;

    // Check if sender has sufficient balance
    const senderBalance = parseFloat(senderWallet.rows[0].balance);
    if (senderBalance < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Get receiver's wallet (with lock)
    const receiverWallet = await client.query(
      'SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE',
      [receiverId]
    );

    if (!receiverWallet.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Receiver wallet not found' });
    }

    // Deduct from sender
    await client.query(
      'UPDATE wallets SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [amount, req.userId!]
    );

    // Add to receiver
    await client.query(
      'UPDATE wallets SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [amount, receiverId]
    );

    // Record transaction for sender
    await client.query(
      `INSERT INTO transactions (wallet_id, sender_id, receiver_id, amount, transaction_type, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [senderWallet.rows[0].id, req.userId!, receiverId, amount, 'SEND', description || 'Transfer', 'completed']
    );

    // Record transaction for receiver
    await client.query(
      `INSERT INTO transactions (wallet_id, sender_id, receiver_id, amount, transaction_type, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [receiverWallet.rows[0].id, req.userId!, receiverId, amount, 'RECEIVE', description || 'Transfer received', 'completed']
    );

    await client.query('COMMIT');

    res.json({
      message: 'Money sent successfully',
      details: {
        amount,
        receiver: receiverEmail,
        description,
      },
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Send money error:', error);
    res.status(500).json({ error: error.message || 'Send money failed' });
  } finally {
    client.release();
  }
}
