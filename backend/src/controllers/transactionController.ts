import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Transaction } from '../models/Transaction';
import pool from '../config/database';

export async function getTransactionHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const transactions = await Transaction.getTransactionsByUserId(req.userId!, limit, offset);
    const totalCount = await Transaction.getTransactionCount(req.userId!);

    res.json({
      transactions: transactions.map((t) => ({
        id: t.id,
        amount: parseFloat(t.amount),
        type: t.transaction_type,
        description: t.description,
        status: t.status,
        senderId: t.sender_id,
        receiverId: t.receiver_id,
        createdAt: t.created_at,
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch transaction history' });
  }
}

export async function getTransactionDetails(req: AuthenticatedRequest, res: Response) {
  try {
    const { transactionId } = req.params;

    const result = await pool.query(
      `SELECT t.*, 
              u1.username as sender_username, u1.email as sender_email,
              u2.username as receiver_username, u2.email as receiver_email
       FROM transactions t
       LEFT JOIN users u1 ON t.sender_id = u1.id
       LEFT JOIN users u2 ON t.receiver_id = u2.id
       WHERE t.id = $1`,
      [transactionId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction: result.rows[0] });
  } catch (error: any) {
    console.error('Get transaction details error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch transaction details' });
  }
}
