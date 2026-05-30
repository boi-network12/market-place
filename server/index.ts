import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import connectDB from './src/config/database';
import { connectRedis, redisClient } from './src/config/redis';
import routes from './src/routes';
import { errorHandler } from './src/middlewares/errorMiddleware';
import { EmailService } from './src/services/emailService';
import { logger } from './src/utils/logger';
import { setupCleanupHandlers } from './src/utils/cleanup'; 


const app = express();

// Updated CORS configuration
const corsOptions = {
    origin: function(origin: any, callback: any) {
        // const allowedOrigins = [
        //      process.env.FRONTEND_URL
        //      || 'http://localhost:3000'
        // ].filter(Boolean);
        const allowedOrigins = ['*', 'https://kamdimarket-place.vercel.app']; // Allow all origins for testing, tighten in
        
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for testing, tighten in production
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
};

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middlewares
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
}));
app.use(cors(corsOptions));
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

// Routes
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

// Error middleware (LAST)
app.use(errorHandler);

// Setup process handlers
setupCleanupHandlers();

// Start app
const startServer = async () => {
    try {
        // Connect to databases
        await connectDB();
        console.log('Database connected');
        
        await connectRedis();
        console.log('Redis connected');

        // Initialize email service
        EmailService.initialize();
        const emailConnected = await EmailService.verifyConnection();
        if (emailConnected) {
            console.log('📧 Email service ready');
        } else {
            console.warn('⚠️ Email service not available');
        }

        const PORT: number = Number(process.env.PORT) || 3001;

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 REST API running on port ${PORT}`);
            console.log(`📝 Health check: http://localhost:${PORT}/health`);
            console.log(`📦 API endpoint: http://localhost:${PORT}/api`);
        });

    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

startServer();

export default app;