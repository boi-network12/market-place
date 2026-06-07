// routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import notificationRoutes from './notificationRoutes';
import profileRoutes from './profileRoutes';
import adminRoutes from './adminRoutes';
import newsLetters from "./newsletterRoutes";

const router = Router();

// API version - MOUNT ROUTES CORRECTLY
router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);
router.use('/profile', profileRoutes); 
router.use('/admin', adminRoutes);
router.use("/newsletter", newsLetters);

// Root API info
router.get('/', (req, res) => {
  res.json({
    name: 'Kamdi Market API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      notifications: '/api/notifications',
      profile: '/api/profile',  
      admin: '/api/admin', 
    },
  });
});

export default router;