import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'kamdi-market-api',
    version: '1.0.0'
  });
});

// API Routes
app.get('/api/products', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'Enterprise Penetration Testing Suite',
        price: 499,
        category: 'cybersecurity',
        inStock: true
      },
      {
        id: '2',
        name: 'Network Vulnerability Scanner Pro',
        price: 299,
        category: 'cybersecurity',
        inStock: true
      }
    ]
  });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    success: true,
    data: {
      id: id,
      name: 'Sample Product',
      price: 99.99,
      description: 'Product description here'
    }
  });
});

app.post('/api/products', (req: Request, res: Response) => {
  const product = req.body;
  // Save to database logic here
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 API endpoint: http://localhost:${PORT}/api/products`);
});

export default app;