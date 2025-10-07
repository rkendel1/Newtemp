import { Router, type Router as ExpressRouter } from 'express';
import { 
  createSubscriberSchema, 
  updateSubscriberSchema,
  recordUsageMetricSchema,
  createWhitelabelConfigSchema,
  updateWhitelabelConfigSchema
} from '@saas-template/schema';
import { validateRequest } from '../middleware/validate-request';
import { supabase } from '../utils/supabase';
import { requireCreator } from '../middleware/role-check';

const router: ExpressRouter = Router();

// Most routes require authentication (except public white-label config)

// GET /api/subscribers - Get all subscribers for a product
router.get('/', requireCreator, async (req, res) => {
  try {
    const { product_id } = req.query;
    
    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' });
    }

    // Verify product belongs to creator
    if (req.user?.creator_id) {
      const { data: product, error: productError } = await supabase
        .from('creator_products')
        .select('id')
        .eq('id', product_id)
        .eq('creator_id', req.user.creator_id)
        .single();

      if (productError || !product) {
        return res.status(404).json({ error: 'Product not found' });
      }
    }

    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('product_id', product_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ subscribers: subscribers || [] });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/subscribers - Create a subscriber
router.post('/', validateRequest(createSubscriberSchema), async (req, res) => {
  try {
    const subscriberData = req.body;
    const { product_id } = req.query;
    
    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' });
    }

    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .insert({
        product_id: product_id as string,
        ...subscriberData,
        subscription_status: 'trialing',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(subscriber);
  } catch (error) {
    console.error('Error creating subscriber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/subscribers/:subscriberId - Get subscriber details
router.get('/:subscriberId', requireCreator, async (req, res) => {
  try {
    const { subscriberId } = req.params;

    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', subscriberId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Subscriber not found' });
      }
      throw error;
    }

    // Verify product belongs to creator
    if (req.user?.creator_id) {
      const { data: product, error: productError } = await supabase
        .from('creator_products')
        .select('id')
        .eq('id', subscriber.product_id)
        .eq('creator_id', req.user.creator_id)
        .single();

      if (productError || !product) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(subscriber);
  } catch (error) {
    console.error('Error fetching subscriber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/subscribers/:subscriberId - Update subscriber
router.patch('/:subscriberId', requireCreator, validateRequest(updateSubscriberSchema), async (req, res) => {
  try {
    const { subscriberId } = req.params;
    const updates = req.body;

    // Verify subscriber exists and creator owns the product
    const { data: subscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('product_id')
      .eq('id', subscriberId)
      .single();

    if (fetchError || !subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    if (req.user?.creator_id) {
      const { data: product, error: productError } = await supabase
        .from('creator_products')
        .select('id')
        .eq('id', subscriber.product_id)
        .eq('creator_id', req.user.creator_id)
        .single();

      if (productError || !product) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const { data: updatedSubscriber, error } = await supabase
      .from('subscribers')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriberId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json(updatedSubscriber);
  } catch (error) {
    console.error('Error updating subscriber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/subscribers/:subscriberId/usage - Record usage metric
router.post('/:subscriberId/usage', validateRequest(recordUsageMetricSchema), async (req, res) => {
  try {
    const { subscriberId } = req.params;
    const metricData = req.body;

    // Get subscriber to find product_id
    const { data: subscriber, error: subscriberError } = await supabase
      .from('subscribers')
      .select('product_id')
      .eq('id', subscriberId)
      .single();

    if (subscriberError || !subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    const { data: metric, error } = await supabase
      .from('usage_metrics')
      .insert({
        subscriber_id: subscriberId,
        product_id: subscriber.product_id,
        ...metricData,
        recorded_at: metricData.recorded_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(metric);
  } catch (error) {
    console.error('Error recording usage metric:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/subscribers/:subscriberId/usage - Get usage metrics for subscriber
router.get('/:subscriberId/usage', requireCreator, async (req, res) => {
  try {
    const { subscriberId } = req.params;
    const { start_date, end_date } = req.query;

    let query = supabase
      .from('usage_metrics')
      .select('*')
      .eq('subscriber_id', subscriberId);

    if (start_date) {
      query = query.gte('recorded_at', start_date);
    }

    if (end_date) {
      query = query.lte('recorded_at', end_date);
    }

    const { data: metrics, error } = await query
      .order('recorded_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ metrics: metrics || [] });
  } catch (error) {
    console.error('Error fetching usage metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/whitelabel/:productId - Get white-label config for product (public)
router.get('/whitelabel/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const { data: config, error } = await supabase
      .from('whitelabel_configs')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'White-label config not found' });
      }
      throw error;
    }

    res.json(config);
  } catch (error) {
    console.error('Error fetching whitelabel config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/whitelabel/:productId - Create white-label config
router.post('/whitelabel/:productId', requireCreator, validateRequest(createWhitelabelConfigSchema), async (req, res) => {
  try {
    const { productId } = req.params;
    const configData = req.body;

    // Verify product belongs to creator
    if (req.user?.creator_id) {
      const { data: product, error: productError } = await supabase
        .from('creator_products')
        .select('id')
        .eq('id', productId)
        .eq('creator_id', req.user.creator_id)
        .single();

      if (productError || !product) {
        return res.status(404).json({ error: 'Product not found' });
      }
    }

    const { data: config, error } = await supabase
      .from('whitelabel_configs')
      .insert({
        product_id: productId,
        ...configData,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(config);
  } catch (error) {
    console.error('Error creating whitelabel config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/whitelabel/:productId - Update white-label config
router.patch('/whitelabel/:productId', requireCreator, validateRequest(updateWhitelabelConfigSchema), async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    // Verify product belongs to creator
    if (req.user?.creator_id) {
      const { data: product, error: productError } = await supabase
        .from('creator_products')
        .select('id')
        .eq('id', productId)
        .eq('creator_id', req.user.creator_id)
        .single();

      if (productError || !product) {
        return res.status(404).json({ error: 'Product not found' });
      }
    }

    const { data: config, error } = await supabase
      .from('whitelabel_configs')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('product_id', productId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'White-label config not found' });
      }
      throw error;
    }

    res.json(config);
  } catch (error) {
    console.error('Error updating whitelabel config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as subscriberRoutes };
