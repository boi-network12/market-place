// controllers/profileController.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/UserModel';
import { logger } from '../utils/logger';
import { UploadService } from '../middlewares/uploadMiddleware'; // Fix: should be '../middlewares/uploadMiddleware'
import { AppError } from '../middlewares/errorMiddleware';

// Extend Express Request type to include userId
interface AuthenticatedRequest extends Request {
  userId: string;
}

export class ProfileController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      
      const user = await User.findById(userId).select(
        '-password -refreshToken -twoFactorSecret -passwordResetCode -passwordResetExpires'
      );
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const {
        fullName,
        phoneNumber,
        bio,
        website,
        company,
        socialLinks,
        notificationPreferences,
      } = req.body;
      
      const updateData: any = {};
      
      if (fullName !== undefined) updateData.fullName = fullName;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (bio !== undefined) updateData.bio = bio;
      if (website !== undefined) updateData.website = website;
      if (company !== undefined) updateData.company = company;
      
      if (socialLinks) {
        if (socialLinks.twitter !== undefined) updateData['socialLinks.twitter'] = socialLinks.twitter;
        if (socialLinks.linkedin !== undefined) updateData['socialLinks.linkedin'] = socialLinks.linkedin;
        if (socialLinks.github !== undefined) updateData['socialLinks.github'] = socialLinks.github;
      }
      
      if (notificationPreferences?.email) {
        if (notificationPreferences.email.marketing !== undefined) {
          updateData['notificationPreferences.email.marketing'] = notificationPreferences.email.marketing;
        }
        if (notificationPreferences.email.security !== undefined) {
          updateData['notificationPreferences.email.security'] = notificationPreferences.email.security;
        }
        if (notificationPreferences.email.updates !== undefined) {
          updateData['notificationPreferences.email.updates'] = notificationPreferences.email.updates;
        }
      }
      
      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password -refreshToken -twoFactorSecret');
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      logger.info(`Profile updated for user ${userId}`);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async uploadAvatar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }
      
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        throw new AppError('User not found', 404);
      }
      
      // Delete old avatar from Cloudinary if exists
      if (currentUser.avatar && currentUser.avatar.includes('cloudinary')) {
        const urlParts = currentUser.avatar.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `users/${userId}/avatar/${filename.split('.')[0]}`;
        await UploadService.deleteImage(publicId);
      }
      
      // Upload new avatar
      const result = await UploadService.uploadAvatar(
        req.file.buffer,
        userId,
        req.file.originalname
      );
      
      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: result.secure_url },
        { new: true }
      ).select('-password -refreshToken -twoFactorSecret');
      
      logger.info(`Avatar updated for user ${userId}`);
      
      res.json({
        success: true,
        message: 'Avatar updated successfully',
        data: {
          avatar: result.secure_url,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async deleteAvatar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      if (user.avatar && user.avatar.includes('cloudinary')) {
        const urlParts = user.avatar.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `users/${userId}/avatar/${filename.split('.')[0]}`;
        await UploadService.deleteImage(publicId);
      }
      
      user.avatar = undefined;
      await user.save();
      
      logger.info(`Avatar deleted for user ${userId}`);
      
      res.json({
        success: true,
        message: 'Avatar deleted successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        throw new AppError('Current password and new password are required', 400);
      }
      
      if (newPassword.length < 8) {
        throw new AppError('New password must be at least 8 characters long', 400);
      }
      
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new AppError('Current password is incorrect', 401);
      }
      
      user.password = newPassword;
      await user.save();
      
      logger.info(`Password changed for user ${userId}`);
      
      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}