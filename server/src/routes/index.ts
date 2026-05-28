// routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// API version
router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);
// router.use('/admin', adminRoutes);

// Root API info
router.get('/', (req, res) => {
  res.json({
    name: 'Kamdi Market API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      admin: '/api/admin',
    },
  });
});

export default router;