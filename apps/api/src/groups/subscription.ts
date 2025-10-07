import { Router, type Router as ExpressRouter } from 'express';
import { supabase } from '../utils/supabase';
import { requireCreator } from '../middleware/role-check';

const router: ExpressRouter = Router();

// All routes require authentication
router.use(requireCreator);

// GET /api/subscriptions - Get creator's platform subscription
router.get('/', async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: creator, error } = await supabase
      .from('saas_creators')
      .select('subscription_status, role')
      .eq('id', req.user.creator_id)
      .single();

    if (error) {
      throw error;
    }

    res.json({
      subscription: {
        id: req.user.creator_id,
        user_id: req.user.id,
        plan: creator.role,
        status: creator.subscription_status,
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/subscriptions/upgrade - Upgrade platform subscription
router.post('/upgrade', async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { plan } = req.body;

    const { data: creator, error } = await supabase
      .from('saas_creators')
      .update({
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.creator_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Subscription upgraded successfully',
      subscription: {
        id: creator.id,
        user_id: creator.user_id,
        plan: creator.role,
        status: creator.subscription_status,
      },
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/subscriptions/cancel - Cancel platform subscription
router.post('/cancel', async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: creator, error } = await supabase
      .from('saas_creators')
      .update({
        subscription_status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.creator_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Subscription cancelled successfully',
      subscription: {
        id: creator.id,
        user_id: creator.user_id,
        plan: creator.role,
        status: creator.subscription_status,
      },
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as subscriptionRoutes };
