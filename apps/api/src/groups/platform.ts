import { Router, type Router as ExpressRouter } from 'express';
import { updatePlatformSettingsSchema } from '@saas-template/schema';
import { validateRequest } from '../middleware/validate-request';
import { requirePlatformOwner } from '../middleware/role-check';

const router: ExpressRouter = Router();

// All routes in this group require platform owner role
router.use(requirePlatformOwner);

// GET /api/platform/settings - Get platform-wide settings
router.get('/settings', async (req, res) => {
  try {
    // TODO: Implement actual database query
    res.json({
      id: '1',
      platform_subscription_price: 2900, // $29 in cents
      platform_subscription_currency: 'USD',
      platform_billing_interval: 'month',
      platform_trial_days: 14,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/platform/settings - Update platform-wide settings
router.patch('/settings', validateRequest(updatePlatformSettingsSchema), async (req, res) => {
  try {
    const updates = req.body;
    
    // TODO: Implement actual database update
    res.json({
      id: '1',
      platform_subscription_price: updates.platform_subscription_price || 2900,
      platform_subscription_currency: updates.platform_subscription_currency || 'USD',
      platform_billing_interval: updates.platform_billing_interval || 'month',
      platform_trial_days: updates.platform_trial_days !== undefined ? updates.platform_trial_days : 14,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/platform/creators - Get all SaaS creators (for platform owner)
router.get('/creators', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // TODO: Implement actual database query with pagination and filtering
    res.json({
      creators: [
        {
          id: '1',
          user_id: '2',
          company_name: 'Example SaaS Inc',
          product_url: 'https://example.com',
          stripe_account_id: 'acct_123',
          onboarding_completed: true,
          subscription_status: 'active',
          role: 'saas_creator',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: '3',
          company_name: 'Another SaaS Co',
          product_url: 'https://another-saas.com',
          stripe_account_id: null,
          onboarding_completed: false,
          subscription_status: 'trial',
          role: 'saas_creator',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: 2,
        totalPages: 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/platform/creators/:creatorId - Get specific creator details
router.get('/creators/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    
    // TODO: Implement actual database query
    res.json({
      id: creatorId,
      user_id: '2',
      company_name: 'Example SaaS Inc',
      product_url: 'https://example.com',
      stripe_account_id: 'acct_123',
      stripe_access_token: '***', // Redacted for security
      stripe_refresh_token: '***', // Redacted for security
      onboarding_completed: true,
      subscription_status: 'active',
      role: 'saas_creator',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/platform/creators/:creatorId - Update creator status/subscription
router.patch('/creators/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { subscription_status } = req.body;
    
    // TODO: Validate input
    // TODO: Implement actual database update
    
    res.json({
      id: creatorId,
      subscription_status: subscription_status || 'active',
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/platform/stats - Get platform-wide statistics
router.get('/stats', async (req, res) => {
  try {
    // TODO: Implement actual database queries for statistics
    res.json({
      total_creators: 2,
      active_creators: 1,
      trial_creators: 1,
      total_products: 5,
      total_subscribers: 150,
      monthly_revenue: 45000, // in cents
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as platformRoutes };
