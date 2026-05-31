// // middleware/admin.middleware.ts

// import { Request, Response, NextFunction } from 'express';
// import { TeamMember } from '../models/AdminTeamModel';
// import { AppError } from './errorMiddleware';

// // Define permissions clearly
// const Permissions = {
//   manageUsers: 'manageUsers',
//   manageSellers: 'manageSellers',
//   manageProducts: 'manageProducts',
//   manageAnnouncements: 'manageAnnouncements',
//   manageTeams: 'manageTeams',
//   viewReports: 'viewReports',
//   manageEmailSubscribers: 'manageEmailSubscribers',
// } as const;

// export type PermissionType = keyof typeof Permissions;

// // Check if user is an admin (has admin role)
// export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     if (!req.userRole) {
//       throw new AppError('Unauthorized', 403);
//     }
    
//     if (req.userRole !== 'admin' && req.userRole !== 'super_admin') {
//       throw new AppError('Admin access required', 403);
//     }
    
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// // Check if user is a team member with specific permissions
// export const requirePermission = (permission: PermissionType) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (!req.userId) {
//         throw new AppError('Unauthorized', 401);
//       }

//       // SUPER ADMIN BYPASS - Super admins have all permissions
//       if (req.userRole === 'super_admin') {
//         return next();
//       }
      
//       const teamMember = await TeamMember.findOne({ userId: req.userId, isActive: true });
      
//       if (!teamMember) {
//         throw new AppError('Access denied: Not a team member', 403);
//       }
      
//       const permissions: Record<PermissionType, string[]> = {
//         manageUsers: ['admin', 'moderator', 'support'],
//         manageSellers: ['admin', 'moderator'],
//         manageProducts: ['admin', 'moderator'],
//         manageAnnouncements: ['admin', 'moderator'],
//         manageTeams: ['admin'],
//         viewReports: ['admin', 'moderator'],
//         manageEmailSubscribers: ['admin'],
//       };
      
//       const allowedRoles = permissions[permission];
//       if (!allowedRoles || !allowedRoles.includes(teamMember.role)) {
//         throw new AppError(`Access denied: ${permission} permission required`, 403);
//       }
      
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };

// // Check if user is super admin
// export const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     if (!req.userRole) {
//       throw new AppError('Unauthorized', 403);
//     }
    
//     if (req.userRole !== 'super_admin') {
//       throw new AppError('Super admin access required', 403);
//     }
    
//     next();
//   } catch (error) {
//     next(error);
//   }
// };
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorMiddleware';

// Permissions mapping (optional, kept for clarity)
export const Permissions = {
  manageUsers: 'manageUsers',
  manageSellers: 'manageSellers',
  manageProducts: 'manageProducts',
  manageAnnouncements: 'manageAnnouncements',
  manageTeams: 'manageTeams',
  viewReports: 'viewReports',
  manageEmailSubscribers: 'manageEmailSubscribers',
} as const;

export type PermissionType = keyof typeof Permissions;

// Check if user is an admin (has admin or super_admin role)
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userRole) {
      throw new AppError('Unauthorized - No role found', 403);
    }
    
    // Check if user has admin or super_admin role
    if (req.userRole !== 'admin' && req.userRole !== 'super_admin') {
      throw new AppError('Admin access required', 403);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Check if user has admin role with optional permission check
// Since you're the only admin, all permissions are granted by default
export const requirePermission = (permission: PermissionType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized - No user ID', 401);
      }

      // Simple admin check - if user is admin or super_admin, grant all permissions
      if (req.userRole === 'admin' || req.userRole === 'super_admin') {
        return next();
      }
      
      // If not admin, deny access
      throw new AppError(`Admin access required`, 403);
    } catch (error) {
      next(error);
    }
  };
};

// Check if user is super admin
export const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userRole) {
      throw new AppError('Unauthorized - No role found', 403);
    }
    
    if (req.userRole !== 'super_admin') {
      throw new AppError('Super admin access required', 403);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};