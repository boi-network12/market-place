// services/email.service.ts
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;

  static initialize() {
    // Zoho Mail requires specific configuration
      this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Make sure sender matches auth user
      from: process.env.SMTP_USER, // Use authenticated user as default
      tls: {
        rejectUnauthorized: false,
      },
    });
  }


  /**
   * Verify transporter connection (call once after initialize)
   */
  static async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('✅ Email service connected successfully (Zoho Mail)');
      return true;
    } catch (error) {
      logger.error('❌ Email service connection failed:', error);
      return false;
    }
  }

  /**
   * Send generic email
   */
  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const fromAddress = process.env.EMAIL_FROM === 'noreply@kamdimarket.com' 
      ? process.env.SMTP_USER  // Fallback to authenticated user
      : process.env.EMAIL_FROM;

      
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        ...options,
      });

      logger.info(`📧 Email sent successfully to: ${options.to}`);
    } catch (error) {
      logger.error(`❌ Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }

  /**
   * Send Welcome Email
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4f46e5;">Welcome to Kamdi Market! 🎉</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining Kamdi Market - your trusted marketplace for cybersecurity tools and enterprise solutions.</p>
        <p>To get started:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Explore our products</li>
          <li>Enable two-factor authentication</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/verify-email" 
           style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
          Verify Your Email
        </a>
        <p>Stay secure,<br>The Kamdi Team</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to Kamdi Market!',
      html,
    });
  }

  // 
  static async sendVerificationEmail(
    email: string,
    data: { name: string; verificationLink: string }
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4f46e5;">Verify Your Email Address ✅</h1>
        <p>Hi ${data.name},</p>
        <p>Please verify your email address to complete your registration on Kamdi Market.</p>
        <p>Click the button below to verify your email:</p>
        
        <a href="${data.verificationLink}" 
          style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold;">
          Verify Email Address
        </a>

        <p style="color: #ef4444;"><strong>This link expires in 24 hours.</strong></p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        
        <p>Stay secure,<br>The Kamdi Team</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - Kamdi Market',
      html,
    });
  }

  /**
   * Send New Login Alert
   */
  static async sendLoginAlert(
    email: string,
    details: { device: string; location: string; time: Date }
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #eab308;">⚠️ New Login Detected</h2>
        <p>We noticed a new login to your Kamdi Market account:</p>
        <ul>
          <li><strong>Device:</strong> ${details.device}</li>
          <li><strong>Location:</strong> ${details.location}</li>
          <li><strong>Time:</strong> ${details.time.toLocaleString()}</li>
        </ul>
        <p>If this was you, you can safely ignore this message.</p>
        <p><strong>If this wasn't you, please secure your account immediately.</strong></p>
        <a href="${process.env.FRONTEND_URL}/security" 
           style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
          Secure Your Account
        </a>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: '⚠️ New Login to Your Kamdi Market Account',
      html,
    });
  }

  static async sendPasswordResetEmail(
    email: string,
    data: { name: string; resetLink: string }
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Reset Your Password 🔑</h2>
        <p>Hi ${data.name},</p>
        <p>You requested to reset your password on Kamdi Market.</p>
        <p>Click the button below to set a new password:</p>
        
        <a href="${data.resetLink}" 
           style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold;">
          Reset Password
        </a>

        <p style="color: #ef4444;"><strong>This link expires in 15 minutes.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        
        <p>Stay secure,<br>The Kamdi Team</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Reset Your Kamdi Market Password',
      html,
    });
  }

  /**
 * Send Password Reset Code Email (6-digit code)
 */
  static async sendPasswordResetCodeEmail(
    email: string,
    data: { name: string; code: string; expiresIn: number }
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin: 0;">Kamdi Market</h1>
          <p style="color: #666; margin-top: 5px;">Password Reset Request</p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0;">Hi ${data.name},</p>
          <p style="margin: 0 0 20px 0;">We received a request to reset your password. Use the verification code below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; background: white; padding: 15px; border-radius: 8px; display: inline-block; border: 1px solid #e0e0e0;">
              ${data.code}
            </div>
          </div>
          
          <p style="margin: 0 0 5px 0; color: #ef4444;"><strong>⏰ This code will expire in ${data.expiresIn} minutes.</strong></p>
          <p style="margin: 0; font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 12px; color: #999;">Stay secure,<br>The Kamdi Team</p>
        </div>
      </div>
    `;
    
    await this.sendEmail({
      to: email,
      subject: '🔐 Password Reset Code - Kamdi Market',
      html,
    });
  }

  /**
 * Send Password Changed Confirmation Email
 */
  static async sendPasswordChangedEmail(
    email: string,
    data: { name: string }
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin: 0;">Kamdi Market</h1>
          <p style="color: #666; margin-top: 5px;">Password Changed Successfully</p>
        </div>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #bbf7d0;">
          <p style="margin: 0 0 10px 0;">Hi ${data.name},</p>
          <p style="margin: 0 0 10px 0;">✅ Your password has been successfully changed.</p>
          <p style="margin: 0; font-size: 14px; color: #666;">If you did not make this change, please contact our support team immediately.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <a href="${process.env.FRONTEND_URL}/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Login to Your Account</a>
        </div>
      </div>
    `;
    
    await this.sendEmail({
      to: email,
      subject: '✅ Password Changed - Kamdi Market',
      html,
    });
  }
}