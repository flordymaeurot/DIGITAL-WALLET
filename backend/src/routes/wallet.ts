import { Router } from 'express';
import { getWallet, cashIn, sendMoney } from '../controllers/walletController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getWallet);
router.post('/cash-in', authMiddleware, cashIn);
router.post('/send-money', authMiddleware, sendMoney);

export default router;
