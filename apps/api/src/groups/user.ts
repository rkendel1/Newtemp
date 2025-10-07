import { Router, type Router as ExpressRouter } from 'express';
import { supabase } from '../utils/supabase';
import { requireCreator } from '../middleware/role-check';

const router: ExpressRouter = Router();

// All routes require authentication
router.use(requireCreator);

// GET /api/users/profile
router.get('/profile', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: user, error } = await supabase.auth.admin.getUserById(req.user.id);

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.user.id,
        email: user.user.email,
        created_at: user.user.created_at,
        updated_at: user.user.updated_at,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/profile
router.put('/profile', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { email } = req.body;

    const { data, error } = await supabase.auth.admin.updateUserById(
      req.user.id,
      { email }
    );

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        updated_at: data.user.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as userRoutes };
