import { Router, Request, Response } from 'express';
import { TransactionModel } from '../models/transaction';

const router = Router();

// Simple authentication middleware
const authenticate = (req: Request, res: Response, next: Function): void => {
  const apiKey = req.headers['x-api-key'] as string;
  const apiSecret = req.headers['x-api-secret'] as string;

 // ADD AUTHENTICATION LOGIC HERE
 

  next();
};

// Generate Quote
router.post('/generate-lr-quote', authenticate, (req: Request, res: Response) => {
  const response = TransactionModel.generateQuote(req.body);
  res.status(response.status).json(response);
});

// Confirm Quote
router.post('/confirm-lr-quote', authenticate, (req: Request, res: Response) => {
  const response = TransactionModel.confirmQuote(req.body);
  res.status(response.status).json(response);
});

// Refresh Quote
router.post('/refresh-lr-quote', authenticate, (req: Request, res: Response) => {
  const response = TransactionModel.refreshQuote(req.body);
  res.status(response.status).json(response);
});

// Get Transaction
router.post('/get-lr-transaction', authenticate, (req: Request, res: Response) => {
  const response = TransactionModel.getTransaction(req.body);
  res.status(response.status).json(response);
});

// Get All Transactions
router.post('/get-lr-transactions', authenticate, (req: Request, res: Response) => {
  const response = TransactionModel.getTransactions(req.body);
  res.status(response.status).json(response);
});

// Auto Transaction Status
router.post('/auto-transaction-status', authenticate, (req: Request, res: Response) => {
  const response = TransactionModel.autoTransactionStatus(req.body);
  res.status(response.status).json(response);
});

export default router; 