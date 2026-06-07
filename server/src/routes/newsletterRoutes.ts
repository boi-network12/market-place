// routes/newsletter.routes.ts
import { Router } from 'express';
import { NewsletterController } from '../controllers/newsLetterController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireAdmin } from '../middlewares/adminMiddleware';

const router = Router();

// Public routes
router.post('/subscribe', NewsletterController.subscribe);
router.post('/unsubscribe', NewsletterController.unsubscribe);

// Admin only routes
router.get('/admin/subscribers', authMiddleware, requireAdmin, NewsletterController.getSubscribers);

export default router;