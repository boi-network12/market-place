// middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { AppError } from './errorMiddleware';

/**
 * Middleware to validate request using express-validator
 */
export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Run all validations
      for (const validation of validations) {
        await validation.run(req);
      }

      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      // Format validation errors - FIXED
      const formattedErrors = errors.array().map((err: ValidationError) => {
        // Handle different error types safely
        if (err.type === 'field') {
          return {
            field: err.path,           // 'path' is the correct property now
            message: err.msg,
            value: err.value,
            location: err.location,
          };
        } 
        else if (err.type === 'alternative' || err.type === 'alternative_grouped') {
          return {
            field: 'unknown',
            message: err.msg,
            type: err.type,
          };
        } 
        else {
          return {
            field: (err as any).path || (err as any).param || 'unknown',
            message: err.msg,
          };
        }
      });

      throw new AppError('Validation failed', 400, formattedErrors);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Helper validation rules (Uncomment and customize as needed)
 */
export const validationRules = {
  email: () => [
    // body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
  ],

  password: (minLength = 8) => [
    // body('password').isLength({ min: minLength }).withMessage(`Password must be at least ${minLength} characters`)
  ],

  fullName: () => [
    // body('fullName').trim().notEmpty().withMessage('Full name is required')
  ],

  username: () => [
    // body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
  ],
};