// controllers/newsletter.controller.ts
import { Request, Response, NextFunction } from 'express';
import { NewsletterService } from '../services/newsLetterService';
import { AppError } from '../middlewares/errorMiddleware';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userName?: string;
}

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

      console.log('📧 Fetching subscribers with filters:', { search, isActive, page, limit });
      
      const result = await NewsletterService.getSubscribers({
        search: search as string,
        isActive: isActive === 'true',
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });

      console.log('✅ Found subscribers:', result.subscribers.length, 'Total:', result.total);
      
      res.json({
        success: true,
        data: {
          subscribers: result.subscribers,
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

   static async sendToSubscribers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { subject, content, htmlContent, subscriberIds } = req.body;
      
      if (!subject || !content) {
        throw new AppError('Subject and content are required', 400);
      }
      
      const result = await NewsletterService.sendToSubscribers(
        subject, 
        content || htmlContent, 
        subscriberIds
      );
      
      res.json({
        success: true,
        message: `Email sent to ${result.sent} subscribers`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export subscribers (Admin only)
   * GET /api/admin/email-subscribers/export
   */
  static async exportSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const { format = 'csv' } = req.query;
      
      const data = await NewsletterService.exportSubscribers(format as 'csv' | 'json');
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
        res.send(data);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=subscribers.json');
        res.send(data);
      }
    } catch (error) {
      next(error);
    }
  }
}