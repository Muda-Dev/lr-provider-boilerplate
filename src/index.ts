import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import transactionRouter from './routes/transaction';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 200,
    message: 'Liquidity Rail Provider API is running',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// API routes
app.use('/api', transactionRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found',
    data: null
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app; 