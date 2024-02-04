import express from 'express';
import {
    checkBalance,
    updateBalance
} from '../controllers/balanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', checkBalance);
router.put('/update', updateBalance);
// router.post('/logout', minuseBalance);

export default router;
