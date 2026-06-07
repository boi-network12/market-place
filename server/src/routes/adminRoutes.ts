// routes/admin.routes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireAdmin, requirePermission, requireSuperAdmin } from '../middlewares/adminMiddleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validationMiddleware';
import { NewsletterSubscriber } from '../models/NewsletterSubscriberModel';
import { NewsletterController } from '../controllers/newsLetterController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);

router.get('/badge-counts', requirePermission('viewReports'), AdminController.getBadgeCounts);

// ====================== USER MANAGEMENT ======================
router.get('/users', requirePermission('manageUsers'), AdminController.getAllUsers);
router.get('/users/:userId', requirePermission('manageUsers'), AdminController.getUserDetails);
router.put('/users/:userId/status', requirePermission('manageUsers'), AdminController.updateUserStatus);
router.put('/users/:userId/role', requirePermission('manageUsers'), AdminController.updateUserRole);
router.delete('/users/:userId', requirePermission('manageUsers'), AdminController.deleteUser);

// ====================== SELLER MANAGEMENT ======================
router.get('/seller-requests', requirePermission('manageSellers'), AdminController.getSellerRequests);
router.get('/seller-requests/:requestId', requirePermission('manageSellers'), AdminController.getSellerRequestDetails);
router.post('/seller-requests/:requestId/approve', requirePermission('manageSellers'), AdminController.approveSellerRequest);
router.post('/seller-requests/:requestId/reject', requirePermission('manageSellers'), AdminController.rejectSellerRequest);

// ====================== TEAM MANAGEMENT ======================
router.get('/team', requirePermission('manageTeams'), AdminController.getTeamMembers);
router.get('/team/search', requirePermission('manageTeams'), AdminController.searchUsers);
router.post('/team', requirePermission('manageTeams'), [
  body('email').isEmail(),
  body('name').notEmpty(),
  body('role').isIn(['admin', 'moderator', 'support']),
], validate, AdminController.addTeamMember);
router.put('/team/:memberId', requirePermission('manageTeams'), [
  body('role').isIn(['admin', 'moderator', 'support']),
], validate, AdminController.updateTeamMemberRole);
router.delete('/team/:memberId', requirePermission('manageTeams'), AdminController.removeTeamMember);

// ====================== ANNOUNCEMENTS ======================
router.post('/announcements', requirePermission('manageAnnouncements'), [
  body('title').notEmpty(),
  body('content').notEmpty(),
], validate, AdminController.createAnnouncement);
router.get('/announcements', requirePermission('manageAnnouncements'), AdminController.getAnnouncements);
router.post('/announcements/:announcementId/send', requirePermission('manageAnnouncements'), AdminController.sendAnnouncement);
router.delete('/announcements/:announcementId', requirePermission('manageAnnouncements'), AdminController.deleteAnnouncement);

// ====================== EMAIL SUBSCRIBER MANAGEMENT ======================
router.get('/email-subscribers', requirePermission('manageEmailSubscribers'), NewsletterController.getSubscribers);
router.post('/email-subscribers/send', requirePermission('manageEmailSubscribers'), NewsletterController.sendToSubscribers);
router.get('/email-subscribers/export', requirePermission('manageEmailSubscribers'), NewsletterController.exportSubscribers);
router.post('/email-subscribers/unsubscribe', requirePermission('manageEmailSubscribers'), AdminController.unsubscribeSubscriber);

router.get('/stats', requirePermission('viewReports'), AdminController.getDashboardStats);

export default router;