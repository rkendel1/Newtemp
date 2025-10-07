import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@saas-template/schema';
import { supabase } from '../utils/supabase';

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
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Authentication required' 
    });
  }
  next();
};

/**
 * Middleware to attach user info to request
 * This should be called after authentication middleware
 */
export const attachUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user context
    }

    const token = authHeader.substring(7);
    
    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return next(); // Continue without user context
    }

    // Query database to get user's creator profile and role
    const { data: creator, error: dbError } = await supabase
      .from('saas_creators')
      .select('id, role')
      .eq('user_id', user.id)
      .single();

    if (dbError || !creator) {
      // User authenticated but no creator profile yet
      req.user = {
        id: user.id,
        role: 'saas_creator',
      };
    } else {
      req.user = {
        id: user.id,
        role: creator.role as UserRole,
        creator_id: creator.id,
      };
    }
    
    next();
  } catch (error) {
    console.error('Error attaching user info:', error);
    next(); // Continue without user context
  }
};
