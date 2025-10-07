import { Router, type Router as ExpressRouter } from 'express';
import { signInSchema, signUpSchema } from '@saas-template/schema';
import { validateRequest } from '../middleware/validate-request';
import { supabase } from '../utils/supabase';

const router: ExpressRouter = Router();

// POST /api/auth/signin
router.post('/signin', validateRequest(signInSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      message: 'Sign in successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/signup
router.post('/signup', validateRequest(signUpSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'User created successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        created_at: data.user?.created_at,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/signout
router.post('/signout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const { error } = await supabase.auth.admin.signOut(token);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Sign out successful' });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as authRoutes };
