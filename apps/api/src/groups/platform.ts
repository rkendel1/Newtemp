import { Router, type Router as ExpressRouter } from 'express';
import { updatePlatformSettingsSchema } from '@saas-template/schema';
import { validateRequest } from '../middleware/validate-request';
import { requirePlatformOwner } from '../middleware/role-check';
import { supabase } from '../utils/supabase';

const router: ExpressRouter = Router();

// All routes in this group require platform owner role
router.use(requirePlatformOwner);

// GET /api/platform/settings - Get platform-wide settings
router.get('/settings', async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('platform_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings yet, return defaults
        return res.json({
          platform_subscription_price: 2900,
          platform_subscription_currency: 'USD',
          platform_billing_interval: 'month',
          platform_trial_days: 14,
        });
      }
      throw error;
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/platform/settings - Update platform-wide settings
router.patch('/settings', validateRequest(updatePlatformSettingsSchema), async (req, res) => {
  try {
    const updates = req.body;
    
    // Check if settings exist
    const { data: existing, error: fetchError } = await supabase
      .from('platform_settings')
      .select('id')
      .limit(1)
      .single();

    let settings;
    if (fetchError && fetchError.code === 'PGRST116') {
      // Create new settings
      const { data, error } = await supabase
        .from('platform_settings')
        .insert({
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      settings = data;
    } else if (fetchError) {
      throw fetchError;
    } else {
      // Update existing settings
      const { data, error } = await supabase
        .from('platform_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      settings = data;
    }

    res.json(settings);
  } catch (error) {
    console.error('Error updating platform settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/platform/creators - Get all SaaS creators (for platform owner)
router.get('/creators', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;
    
    let query = supabase
      .from('saas_creators')
      .select('*', { count: 'exact' });

    if (status) {
      query = query.eq('subscription_status', status);
    }

    const { data: creators, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) {
      throw error;
    }

    const totalPages = count ? Math.ceil(count / limitNum) : 0;

    res.json({
      creators: creators || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching creators:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/platform/creators/:creatorId - Get specific creator details
router.get('/creators/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    
    const { data: creator, error } = await supabase
      .from('saas_creators')
      .select('*')
      .eq('id', creatorId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Creator not found' });
      }
      throw error;
    }

    // Redact sensitive information
    if (creator.stripe_access_token) {
      creator.stripe_access_token = '***';
    }
    if (creator.stripe_refresh_token) {
      creator.stripe_refresh_token = '***';
    }

    res.json(creator);
  } catch (error) {
    console.error('Error fetching creator:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/platform/creators/:creatorId - Update creator status/subscription
router.patch('/creators/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { subscription_status } = req.body;
    
    if (!subscription_status) {
      return res.status(400).json({ error: 'subscription_status is required' });
    }

    const { data: creator, error } = await supabase
      .from('saas_creators')
      .update({
        subscription_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', creatorId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Creator not found' });
      }
      throw error;
    }

    res.json(creator);
  } catch (error) {
    console.error('Error updating creator:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/platform/stats - Get platform-wide statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total creators
    const { count: totalCreators } = await supabase
      .from('saas_creators')
      .select('*', { count: 'exact', head: true });

    // Get active creators
    const { count: activeCreators } = await supabase
      .from('saas_creators')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    // Get trial creators
    const { count: trialCreators } = await supabase
      .from('saas_creators')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'trial');

    // Get total products
    const { count: totalProducts } = await supabase
      .from('creator_products')
      .select('*', { count: 'exact', head: true });

    // Get total subscribers
    const { count: totalSubscribers } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });

    res.json({
      total_creators: totalCreators || 0,
      active_creators: activeCreators || 0,
      trial_creators: trialCreators || 0,
      total_products: totalProducts || 0,
      total_subscribers: totalSubscribers || 0,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as platformRoutes };
