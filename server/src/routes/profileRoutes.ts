import { Router, Request } from 'express';
import { upload } from '../middlewares/uploadMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validationMiddleware';
import { ProfileController } from '../controllers/profileController';

const router = Router();

// All profile routes require authentication
router.use(authMiddleware);

// Profile CRUD
router.get('/', (req, res, next) => 
  ProfileController.getProfile(req as any, res, next)
);

router.put('/',
  validate([
    body('fullName').optional().trim().notEmpty(),
    body('phoneNumber').optional().isMobilePhone('any'),
    body('bio').optional().isString().isLength({ max: 500 }),
    body('website').optional().isURL(),
    body('company').optional().isString(),
    body('socialLinks.twitter').optional().isURL(),
    body('socialLinks.linkedin').optional().isURL(),
    body('socialLinks.github').optional().isURL(),
  ]),
  (req, res, next) => ProfileController.updateProfile(req as any, res, next)
);

// Avatar management
router.post('/avatar',
  upload.single('avatar'),
  (req, res, next) => ProfileController.uploadAvatar(req as any, res, next)
);

router.delete('/avatar', 
  (req, res, next) => ProfileController.deleteAvatar(req as any, res, next)
);

// Password change
router.post('/change-password',
  validate([
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }),
  ]),
  (req, res, next) => ProfileController.changePassword(req as any, res, next)
);

export default router;