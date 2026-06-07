// routes/adminEmail.routes.ts
import { Router } from 'express';
import { EmailCampaignController } from '../controllers/emailCampaignController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireAdmin, requirePermission } from '../middlewares/adminMiddleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validationMiddleware';

const router = Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);
router.use(requirePermission('manageEmailSubscribers'));

// Campaign CRUD
router.get('/campaigns', EmailCampaignController.getCampaigns);
router.get('/campaigns/:id', EmailCampaignController.getCampaign);
router.post('/campaigns', [
  body('subject').notEmpty(),
  body('content').notEmpty(),
  body('htmlContent').notEmpty(),
  body('recipientType').isIn(['all', 'subscribers', 'users', 'specific']),
], validate, EmailCampaignController.createCampaign);
router.put('/campaigns/:id', EmailCampaignController.updateCampaign);
router.delete('/campaigns/:id', EmailCampaignController.deleteCampaign);
router.post('/campaigns/:id/send', EmailCampaignController.sendCampaign);

// Quick send endpoints
router.post('/send-to-users', [
  body('subject').notEmpty(),
  body('content').notEmpty(),
  body('htmlContent').notEmpty(),
  body('userIds').isArray(),
], validate, EmailCampaignController.sendToSpecificUsers);

router.post('/send-to-subscribers', [
  body('subject').notEmpty(),
  body('content').notEmpty(),
  body('htmlContent').notEmpty(),
], validate, EmailCampaignController.sendToAllSubscribers);

router.post('/send-to-all-users', [
  body('subject').notEmpty(),
  body('content').notEmpty(),
  body('htmlContent').notEmpty(),
], validate, EmailCampaignController.sendToAllUsers);

export default router;