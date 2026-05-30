import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './src/config/database';
import { connectRedis, redisClient } from './src/config/redis';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { logger } from './src/utils/logger';
import routes from './src/routes';
import { errorHandler } from './src/middlewares/error.middleware';
import { EmailService } from './src/services/email.service';


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to databases
connectDB();
connectRedis();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});


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
app.use(limiter);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  const redisStatus = redisClient?.isReady ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'kamdi-market-api',
    version: '2.0.0',
    databases: {
      mongodb: 'connected',
      redis: redisStatus,
    },
  });
});

// API Routes
app.use('/api', routes);

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
    },
  });
});

// initialize email service
EmailService.initialize();
EmailService.verifyConnection().then(connected => {
  if (connected) {
    console.log('📧 Email service ready');
  } else {
    console.warn('⚠️ Email service not available');
  }
});

// Global error handler
app.use(errorHandler);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 API endpoint: http://localhost:${PORT}/api`);
});

export default app;