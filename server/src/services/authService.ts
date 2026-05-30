// services/auth.service.ts
import jwt from 'jsonwebtoken';
import { IUser } from '../models/UserModel';

export class AuthService {
  static generateTokens(user: IUser, expiry: string = '7d') {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET!,
      { expiresIn: expiry } as jwt.SignOptions
    );
    
    const refreshToken = jwt.sign(
      {
        userId: user._id,
        type: 'refresh',
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '30d' } as jwt.SignOptions
    );
    
    return { accessToken, refreshToken };
  }

  // ====================== PASSWORD RESET ======================
  static generateResetToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id, type: 'password-reset' },
      process.env.JWT_RESET_SECRET!, // Add this to .env
      { expiresIn: '15m' } as jwt.SignOptions // Short lived
    );
  }

  static verifyResetToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_RESET_SECRET!);
    } catch (error) {
      return null;
    }
  }

  // ====================== EMAIL VERIFICATION ======================
  static generateEmailVerificationToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id, type: 'email-verification' },
      process.env.JWT_EMAIL_SECRET!, // Add this to .env
      { expiresIn: '24h' } as jwt.SignOptions
    );
  }

  static verifyEmailToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_EMAIL_SECRET!);
    } catch (error) {
      return null;
    }
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return null;
    }
  }
  
  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    } catch (error) {
      return null;
    }
  }
}