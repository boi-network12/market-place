// controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User.model';
import { Session } from '../models/Session.model';
import { LocationService } from '../services/location.service';
import { DeviceService, DeviceInfo } from '../services/device.service';
import { logger } from '../utils/logger';
import { AuthService } from '../services/auth.service';
import { AppError } from '../middlewares/error.middleware';
import { EmailService } from '../services/email.service';

export class AuthController {
  // ====================== REGISTER ======================
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, phoneNumber } = req.body;
      const ip = req.ip || req.socket.remoteAddress || '0.0.0.0';
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }

      const location = await LocationService.getLocationFromIP(ip);
      const deviceInfo = DeviceService.getDeviceInfo(userAgent, ip);

      // Generate unique username
      let username = email.split('@')[0].toLowerCase();
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${email.split('@')[0].toLowerCase()}${counter}`;
        counter++;
      }

      const user = new User({
        username,
        email,
        password,
        fullName,
        phoneNumber,
        emailVerified: false,
        location: {
          country: location.country,
          city: location.city,
          ipAddress: ip,
          coordinates: { lat: location.lat, lng: location.lng },
          registeredAt: new Date(),
        },
        devices: [{
          deviceId: deviceInfo.deviceId,
          deviceName: deviceInfo.deviceName,
          deviceType: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          ipAddress: ip,
          location: {
            country: location.country,
            city: location.city,
            lat: location.lat,
            lng: location.lng,
            timezone: location.timezone || 'UTC',
          },
          lastLogin: new Date(),
          isActive: true,
        }],
        lastLogin: new Date(),
        lastLoginLocation: {
          ip,
          device: deviceInfo.deviceName,
          location: `${location.city}, ${location.country}`,
          timestamp: new Date(),
        },
      });

      await user.save();

      // Generate verification token and send email
      const verificationToken = AuthService.generateEmailVerificationToken(user);
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

       // Send verification email (non-blocking)
      EmailService.sendVerificationEmail(user.email, {
        name: user.fullName,
        verificationLink,
      }).catch(err => logger.error('Verification email failed:', err));

      logger.info(`New user registered: ${user.email} (unverified)`);



      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            emailVerified: false,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ====================== LOGIN ======================
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, rememberMe } = req.body;
      const ip = req.ip || req.socket.remoteAddress || '0.0.0.0';
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const user = await User.findOne({ email });
      if (!user) throw new AppError('Invalid credentials', 401);

      if (user.status === 'banned') {
        throw new AppError('Account has been banned. Contact support.', 403);
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) throw new AppError('Invalid credentials', 401);

      if (!user.emailVerified) {
        throw new AppError('Please verify your email before logging in', 403);
      }

      const location = await LocationService.getLocationFromIP(ip);
      const deviceInfo = DeviceService.getDeviceInfo(userAgent, ip);

      // Update or add device
      const existingDevice = user.devices.find(d => d.deviceId === deviceInfo.deviceId);

      if (existingDevice) {
        existingDevice.lastLogin = new Date();
        existingDevice.ipAddress = ip;
        existingDevice.location = {
          country: location.country,
          city: location.city,
          lat: location.lat,
          lng: location.lng,
          timezone: location.timezone || 'UTC',
        };
      } else {
        user.devices.push({
          deviceId: deviceInfo.deviceId,
          deviceName: deviceInfo.deviceName,
          deviceType: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          ipAddress: ip,
          location: {
            country: location.country,
            city: location.city,
            lat: location.lat,
            lng: location.lng,
            timezone: location.timezone || 'UTC',
          },
          lastLogin: new Date(),
          isActive: true,
        });
      }

      // Update login history
      user.loginHistory.push({
        ip,
        device: deviceInfo.deviceName,
        location: `${location.city}, ${location.country}`,
        timestamp: new Date(),
      });

      if (user.loginHistory.length > 50) {
        user.loginHistory = user.loginHistory.slice(-50);
      }

      user.lastLogin = new Date();
      user.lastLoginLocation = {
        ip,
        device: deviceInfo.deviceName,
        location: `${location.city}, ${location.country}`,
        timestamp: new Date(),
      };

      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = AuthService.generateTokens(user, rememberMe ? '30d' : '7d');

      // Invalidate old sessions for same device
      await Session.updateMany(
        { userId: user._id, deviceId: deviceInfo.deviceId, isActive: true },
        { isActive: false }
      );

      const session = new Session({
        userId: user._id,
        token: accessToken,
        refreshToken,
        deviceId: deviceInfo.deviceId,
        deviceInfo: {
          name: deviceInfo.deviceName,
          type: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
        },
        ipAddress: ip,
        location: {
          country: location.country,
          city: location.city,
          lat: location.lat,
          lng: location.lng,
        },
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
      });

      await session.save();

      // Set cookies
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000,
      });

      // Send login alert (non-blocking)
      EmailService.sendLoginAlert(user.email, {
        device: deviceInfo.deviceName,
        location: `${location.city}, ${location.country}`,
        time: new Date(),
      }).catch(err => logger.error('Login alert email failed:', err));

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            isSeller: user.isSeller,
            sellerApproved: user.sellerApproved,
            emailVerified: user.emailVerified,
          },
          accessToken,
        },
      });

       // Log success
      logger.info(`User logged in successfully: ${user.email}`);
    } catch (error) {
      next(error);
    }
  }

  // ====================== REFRESH TOKEN ======================
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        throw new AppError('Refresh token is required', 401);
      }

      const decoded = AuthService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      const session = await Session.findOne({
        refreshToken,
        isActive: true,
        expiresAt: { $gt: new Date() },
      });

      if (!session) throw new AppError('Session expired', 401);

      const user = await User.findById(session.userId);
      if (!user) throw new AppError('User not found', 404);

      const { accessToken, refreshToken: newRefreshToken } = AuthService.generateTokens(user);

      session.token = accessToken;
      if (newRefreshToken) session.refreshToken = newRefreshToken;
      session.lastActivity = new Date();
      await session.save();

      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      if (newRefreshToken) {
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      }

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  // ====================== FORGOT PASSWORD ======================
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists (security)
        return res.status(200).json({
          success: true,
          message: 'If an account with that email exists, a reset link has been sent.',
        });
      }

      const resetToken = AuthService.generateResetToken(user); // You'll need to implement this
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      await EmailService.sendPasswordResetEmail(user.email, {
        name: user.fullName,
        resetLink,
      });

      logger.info(`Password reset requested for: ${email}`);

      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  }

  // ====================== RESET PASSWORD ======================
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;

      const decoded = AuthService.verifyResetToken(token);
      if (!decoded) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      const user = await User.findById(decoded.userId);
      if (!user) throw new AppError('User not found', 404);

      user.password = newPassword; // Will be hashed by pre-save middleware
      await user.save();

      // Invalidate all sessions for security
      await Session.deleteMany({ userId: user._id });

      logger.info(`Password reset successful for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Password reset successful. Please login with your new password.',
      });
    } catch (error) {
      next(error);
    }
  }

  // ====================== VERIFY EMAIL ======================
  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      
      if (!token || typeof token !== 'string') {
        throw new AppError('Verification token is required', 400);
      }

      const decoded = AuthService.verifyEmailToken(token);
      if (!decoded) {
        throw new AppError('Invalid or expired verification token', 400);
      }

      const user = await User.findById(decoded.userId);
      if (!user) throw new AppError('User not found', 404);

      if (user.emailVerified) {
        return res.json({
          success: true,
          message: 'Email already verified',
        });
      }

      user.emailVerified = true;
      await user.save();

       logger.info(`Email verified for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Email verified successfully',
        data: { emailVerified: true }
      });
    } catch (error) {
      next(error);
    }
  }

  // ====================== OTHER METHODS ======================
  // Logout user
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.token;
      
      if (token) {
        await Session.findOneAndUpdate(
          { token, isActive: true },
          { isActive: false }
        );
      }
      
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get current user with sessions
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.userId).select('-password -refreshToken -twoFactorSecret');
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // Get active sessions
      const activeSessions = await Session.find({
        userId: user._id,
        isActive: true,
        expiresAt: { $gt: new Date() },
      }).select('-token -refreshToken');

      // ✅ Convert to plain object and ensure emailVerified is included
      const userObject = user.toObject();
      
      res.json({
        success: true,
        data: {
          user: {
            ...userObject,
            emailVerified: user.emailVerified,
          },
          activeSessions,
          devices: user.devices.filter(d => d.isActive),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Resend verification email
  static async resendVerificationEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      
      if (!email) {
        throw new AppError('Email is required', 400);
      }
      
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists for security
        return res.status(200).json({
          success: true,
          message: 'If an account exists, a verification email has been sent.',
        });
      }
      
      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified',
        });
      }
      
      // Generate verification token
      const verificationToken = AuthService.generateEmailVerificationToken(user);
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      
      // Send verification email
      await EmailService.sendVerificationEmail(user.email, {
        name: user.fullName,
        verificationLink,
      });
      
      logger.info(`Verification email resent to: ${email}`);
      
      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully',
      });
    } catch (error) {
      next(error);
    }
  }
    
  // Become a seller (request seller status)
  static async becomeSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      if (user.isSeller) {
        throw new AppError('Already a seller', 400);
      }
      
      // Check if user has subscription
      const hasSubscription = user.sellerSubscription?.active;
      
      if (!hasSubscription) {
        // Create subscription request
        // This would typically redirect to payment
        throw new AppError('Please subscribe to a seller plan first', 402);
      }
      
      user.isSeller = true;
      user.sellerApproved = false; // Requires admin approval
      await user.save();
      
      // Notify admin
      // EmailService.notifyAdminNewSeller(user.email);
      
      res.json({
        success: true,
        message: 'Seller request submitted. Awaiting admin approval.',
      });
    } catch (error) {
      next(error);
    }
  }
}