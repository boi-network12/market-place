// routes/notification.routes.ts
import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

// Notification CRUD operations
router.get('/', NotificationController.getNotifications);
router.get('/unread/count', NotificationController.getUnreadCount);
router.put('/:id/read', NotificationController.markAsRead);
router.put('/read-all', NotificationController.markAllAsRead);
router.delete('/:id', NotificationController.deleteNotification);
router.delete('/', NotificationController.deleteAllNotifications);

// Notification preferences
router.get('/preferences', NotificationController.getPreferences);
router.put('/preferences/email', validate([
  body('enabled').optional().isBoolean(),
  body('types.system').optional().isBoolean(),
  body('types.security').optional().isBoolean(),
  body('types.order').optional().isBoolean(),
  body('types.payment').optional().isBoolean(),
  body('types.product').optional().isBoolean(),
  body('types.seller').optional().isBoolean(),
  body('types.message').optional().isBoolean(),
]), NotificationController.updateEmailPreferences);

router.put('/preferences/push', validate([
  body('enabled').optional().isBoolean(),
  body('types.system').optional().isBoolean(),
  body('types.security').optional().isBoolean(),
  body('types.order').optional().isBoolean(),
  body('types.payment').optional().isBoolean(),
  body('types.product').optional().isBoolean(),
  body('types.seller').optional().isBoolean(),
  body('types.message').optional().isBoolean(),
]), NotificationController.updatePushPreferences);

router.put('/preferences/in-app', validate([
  body('enabled').optional().isBoolean(),
  body('types.system').optional().isBoolean(),
  body('types.security').optional().isBoolean(),
  body('types.order').optional().isBoolean(),
  body('types.payment').optional().isBoolean(),
  body('types.product').optional().isBoolean(),
  body('types.seller').optional().isBoolean(),
  body('types.message').optional().isBoolean(),
]), NotificationController.updateInAppPreferences);

router.put('/preferences/quiet-hours', validate([
  body('enabled').optional().isBoolean(),
  body('start').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('end').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('timezone').optional().isString(),
]), NotificationController.updateQuietHours);

router.post('/preferences/reset', NotificationController.resetPreferences);

// Device token management
router.post('/device-token', validate([
  body('deviceToken').notEmpty().isString(),
]), NotificationController.registerDeviceToken);

router.delete('/device-token', validate([
  body('deviceToken').notEmpty().isString(),
]), NotificationController.unregisterDeviceToken);

export default router;