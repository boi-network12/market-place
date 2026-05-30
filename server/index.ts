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

// Flag to track if databases are connected (for serverless cold starts)
let isDatabaseConnected = false;
let isRedisConnected = false;

// Rate limiting (keep your original but adjust for serverless)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Keep your original limit
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Add keyGenerator to work behind proxies (serverless platforms)
  keyGenerator: (req: Request) => {
    return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
  },
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

// Database connection middleware with lazy loading (no new env vars)
async function ensureDatabaseConnection() {
  if (!isDatabaseConnected) {
    await connectDB();
    isDatabaseConnected = true;
    logger.info('MongoDB connected');
  }
}

async function ensureRedisConnection() {
  if (process.env.REDIS_URL && !isRedisConnected) {
    try {
      await connectRedis();
      isRedisConnected = true;
      logger.info('Redis connected');
    } catch (error) {
      logger.warn('Redis connection failed:', error);
    }
  }
}

// Health check endpoint (keep your original)
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

// API Routes with lazy connection (no new env vars)
app.use('/api', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ensureDatabaseConnection();
    await ensureRedisConnection();
    next();
  } catch (error) {
    logger.error('Database connection error:', error);
    res.status(503).json({
      success: false,
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Service temporarily unavailable. Please try again.',
      },
    });
  }
});

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

// initialize email service (keep your original)
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

// Start server - modified to work with serverless AND traditional hosting
// This checks if we're in a serverless environment by detecting if the file is being imported
// rather than run directly (works with Vercel, AWS Lambda, etc.)
const isServerless = process.env.NODE_ENV === 'production' && !process.env.PORT;

if (!isServerless) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
    console.log(`📦 API endpoint: http://localhost:${PORT}/api`);
  });
  
  // Pre-connect for traditional hosting
  connectDB().then(() => {
    console.log('✅ MongoDB connected');
    if (process.env.REDIS_URL) {
      connectRedis().catch(console.warn);
    }
  });
}

export default app;