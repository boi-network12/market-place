// routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';


const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('fullName').notEmpty().trim(),
  body('phoneNumber').optional().isMobilePhone('any'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('rememberMe').optional().isBoolean(),
];

// Routes
router.post('/register', validate(registerValidation), AuthController.register);
router.post('/login', validate(loginValidation), AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/me', authMiddleware, AuthController.getMe);
router.post('/become-seller', authMiddleware, AuthController.becomeSeller);
router.post('/become-seller-request', authMiddleware, AuthController.requestToBecomeSeller);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/resend-verification', AuthController.resendVerificationEmail);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-reset-code', AuthController.verifyResetCode);
router.post('/reset-password', AuthController.resetPassword);
router.post('/verify-email/:token', AuthController.verifyEmail);

export default router;