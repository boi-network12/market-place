// services/passwordResetService.ts
import crypto from 'crypto';
import { User } from '../models/UserModel';
import { EmailService } from './emailService';
import { logger } from '../utils/logger';
import { Session } from '../models/SessionModel';
import { NotificationService } from './notificationService';

export class PasswordResetService {
  
  /**
   * Generate a 6-digit reset code
   */
  static generateResetCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  /**
   * Request password reset - sends 6-digit code to email
   */
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await User.findOne({ email });
      
      // Don't reveal if email exists for security
      if (!user) {
        logger.info(`Password reset requested for non-existent email: ${email}`);
        return {
          success: true,
          message: 'If an account with that email exists, a reset code has been sent.',
        };
      }
      
      // Check if user is banned
      if (user.status === 'banned') {
        logger.warn(`Banned user attempted password reset: ${email}`);
        return {
          success: true,
          message: 'If an account with that email exists, a reset code has been sent.',
        };
      }
      
      // Generate 6-digit code
      const resetCode = this.generateResetCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      
      // Save to database
      user.passwordResetCode = resetCode;
      user.passwordResetExpires = expiresAt;
      await user.save();
      
      // Send email with code
      await EmailService.sendPasswordResetCodeEmail(user.email, {
        name: user.fullName,
        code: resetCode,
        expiresIn: 15,
      });
      
      logger.info(`Password reset code sent to: ${email}`);
      
      return {
        success: true,
        message: 'If an account with that email exists, a reset code has been sent.',
      };
    } catch (error) {
      logger.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Failed to process password reset request. Please try again.',
      };
    }
  }
  
  /**
   * Verify the 6-digit reset code
   */
  static async verifyResetCode(email: string, code: string): Promise<{ valid: boolean; message: string }> {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return { valid: false, message: 'Invalid or expired reset code' };
      }
      
      // Check if code exists and not expired
      if (!user.passwordResetCode || !user.passwordResetExpires) {
        return { valid: false, message: 'No reset code found. Please request a new one.' };
      }
      
      if (user.passwordResetExpires < new Date()) {
        return { valid: false, message: 'Reset code has expired. Please request a new one.' };
      }
      
      if (user.passwordResetCode !== code) {
        return { valid: false, message: 'Invalid reset code. Please try again.' };
      }
      
      return { valid: true, message: 'Code verified successfully' };
    } catch (error) {
      logger.error('Reset code verification error:', error);
      return { valid: false, message: 'Failed to verify reset code' };
    }
  }
  
  /**
   * Reset password using code verification
   */
  static async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // First verify the code
      const verification = await this.verifyResetCode(email, code);
      
      if (!verification.valid) {
        return { success: false, message: verification.message };
      }
      
      const user = await User.findOne({ email });
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      // Update password
      user.password = newPassword;
      
      // Clear reset code fields
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      
      await user.save();
      
      // Invalidate all sessions for security
      await Session.deleteMany({ userId: user._id });
      
      // Send confirmation email
      await EmailService.sendPasswordChangedEmail(user.email, {
        name: user.fullName,
      }).catch(err => logger.error('Password changed email failed:', err));
      
      // Create notification
      await NotificationService.createNotification({
        userId: user._id,
        type: 'security',
        title: 'Password Changed Successfully 🔒',
        message: 'Your password has been changed. If you did not perform this action, please contact support immediately.',
        priority: 'high',
        actionUrl: '/security',
        actionLabel: 'Review Security',
        data: { changeTime: new Date() }
      }).catch(err => logger.error('Password change notification failed:', err));
      
      logger.info(`Password reset successful for user: ${user.email}`);
      
      return {
        success: true,
        message: 'Password reset successful. Please login with your new password.',
      };
    } catch (error) {
      logger.error('Password reset error:', error);
      return {
        success: false,
        message: 'Failed to reset password. Please try again.',
      };
    }
  }
}