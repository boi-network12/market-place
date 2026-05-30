import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './src/config/database';
// import { connectRedis, redisClient } from './src/config/redis';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { logger } from './src/utils/logger';
import routes from './src/routes';
import { errorHandler } from './src/middlewares/error.middleware';
import { EmailService } from './src/services/email.service';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'kamdi-market-api',
    version: '2.0.0',
  });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
    },
  });
});

// Global error handler
app.use(errorHandler);

// Only start server if NOT on Vercel
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
  });
  
  // Connect to databases locally
  connectDB();
  // if (process.env.REDIS_URL) connectRedis();
  EmailService.initialize();
}

// Export for Vercel
export default app;