// routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import notificationRoutes from './notificationRoutes';

const router = Router();

// API version
router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);

// Root API info
router.get('/', (req, res) => {
  res.json({
    name: 'Kamdi Market API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      notifications: '/api/notifications',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      admin: '/api/admin',
    },
  });
});

export default router;