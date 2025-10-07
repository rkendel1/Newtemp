import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@saas-template/schema';

// Extend Express Request to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        creator_id?: string;
      };
    }
  }
}

/**
 * Middleware to check if user has platform owner role
 */
export const requirePlatformOwner = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Get user role from database based on auth token
  // For now, using mock data
  const userRole = req.user?.role || 'saas_creator';
  
  if (userRole !== 'platform_owner') {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'This action requires platform owner privileges' 
    });
  }
  
  next();
};

/**
 * Middleware to check if user has at least SaaS creator role
 */
export const requireCreator = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement actual auth check
  // For now, allowing all requests
  next();
};

/**
 * Middleware to attach user info to request
 * This should be called after authentication middleware
 */
export const attachUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Get user_id from auth token (e.g., JWT)
    // TODO: Query database to get user's creator profile and role
    
    // Mock implementation - replace with actual database query
    req.user = {
      id: '1',
      role: 'saas_creator', // This should come from database
      creator_id: '1',
    };
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user information' });
  }
};
