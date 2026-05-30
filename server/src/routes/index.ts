// routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import notificationRoutes from './notificationRoutes';
import profileRoutes from './profileRoutes';

const router = Router();

// API version - MOUNT ROUTES CORRECTLY
router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);
router.use('/profile', profileRoutes);  // Make sure this line exists

// Root API info
router.get('/', (req, res) => {
  res.json({
    name: 'Kamdi Market API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      notifications: '/api/notifications',
      profile: '/api/profile',  // Add profile endpoint
    },
  });
});

export default router;