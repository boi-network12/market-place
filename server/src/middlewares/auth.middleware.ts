// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { Session } from '../models/Session.model';
import { AppError } from './error.middleware';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      sessionId?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }
    
    if (!token) {
      throw new AppError('Authentication required', 401);
    }
    
    // Verify token
    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      throw new AppError('Invalid or expired token', 401);
    }
    
    // Check if session exists and is active
    const session = await Session.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
    
    if (!session) {
      throw new AppError('Session expired. Please login again.', 401);
    }
    
    // Update last activity
    session.lastActivity = new Date();
    await session.save();
    
    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.sessionId = session._id.toString();
    
    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return next(new AppError('Unauthorized', 403));
    }
    
    if (!roles.includes(req.userRole)) {
      return next(new AppError('Access denied. Insufficient permissions.', 403));
    }
    
    next();
  };
};