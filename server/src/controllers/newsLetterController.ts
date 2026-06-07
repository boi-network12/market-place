// controllers/newsletter.controller.ts
import { Request, Response, NextFunction } from 'express';
import { NewsletterService } from '../services/newsLetterService';
import { AppError } from '../middlewares/errorMiddleware';
import { logger } from '../utils/logger';

export class NewsletterController {
  
  /**
   * Subscribe to newsletter
   * POST /api/newsletter/subscribe
   */
  static async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, interests, source } = req.body;
      const ip = req.ip || req.socket.remoteAddress || '0.0.0.0';
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const location = `${req.headers['cf-ipcountry'] || 'Unknown'}`;
      
      if (!email) {
        throw new AppError('Email is required', 400);
      }
      
      if (!email.match(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)) {
        throw new AppError('Please enter a valid email address', 400);
      }
      
      const result = await NewsletterService.subscribe({
        email,
        interests: interests || [],
        source: source || 'footer_newsletter',
        ip,
        userAgent,
        location,
      });
      
      res.status(200).json({
        success: result.success,
        message: result.message,
        data: result.subscriber ? { email: result.subscriber.email } : null,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Unsubscribe from newsletter
   * POST /api/newsletter/unsubscribe
   */
  static async unsubscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      
      if (!email) {
        throw new AppError('Email is required', 400);
      }
      
      const result = await NewsletterService.unsubscribe(email);
      
      res.status(200).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all subscribers (Admin only)
   * GET /api/admin/newsletter/subscribers
   */
  static async getSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, isActive, page, limit } = req.query;
      
      const result = await NewsletterService.getSubscribers({
        search: search as string,
        isActive: isActive === 'true',
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}