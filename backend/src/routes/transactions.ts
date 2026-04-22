import { Router } from 'express';
import { getTransactionHistory, getTransactionDetails } from '../controllers/transactionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getTransactionHistory);
router.get('/:transactionId', authMiddleware, getTransactionDetails);

export default router;
