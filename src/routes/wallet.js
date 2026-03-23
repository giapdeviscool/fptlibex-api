import express from 'express';
import WalletController from '../controller/wallet.controller.js';

const router = express.Router();

router.post('/deposit', WalletController.deposit);
router.post('/withdraw', WalletController.withdraw);
router.get('/balance', WalletController.getBalance);
router.get('/history', WalletController.getHistory);

export default router;
