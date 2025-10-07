import { Router, type Router as ExpressRouter } from 'express';
import { 
  createCreatorSchema, 
  updateCreatorSchema,
  createProductSchema,
  updateProductSchema,
  createPricingTierSchema,
  updatePricingTierSchema
} from '@saas-template/schema';
import { validateRequest } from '../middleware/validate-request';
import { supabase } from '../utils/supabase';
import { requireCreator } from '../middleware/role-check';

const router: ExpressRouter = Router();

// All routes require authentication
router.use(requireCreator);

// GET /api/creators/me - Get current creator profile
router.get('/me', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: creator, error } = await supabase
      .from('saas_creators')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Creator profile not found' });
      }
      throw error;
    }

    res.json(creator);
  } catch (error) {
    console.error('Error fetching creator:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/creators - Create creator profile
router.post('/', validateRequest(createCreatorSchema), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { company_name, product_url } = req.body;

    // Check if this is the first user in the database
    const { count, error: countError } = await supabase
      .from('saas_creators')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    const isFirstUser = count === 0;
    const role = isFirstUser ? 'platform_owner' : 'saas_creator';

    const { data: creator, error } = await supabase
      .from('saas_creators')
      .insert({
        user_id: req.user.id,
        company_name,
        product_url,
        role,
        onboarding_completed: false,
        subscription_status: 'trial',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(creator);
  } catch (error) {
    console.error('Error creating creator:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/creators/me - Update creator profile
router.patch('/me', validateRequest(updateCreatorSchema), async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updates = req.body;

    const { data: creator, error } = await supabase
      .from('saas_creators')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.creator_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json(creator);
  } catch (error) {
    console.error('Error updating creator:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/creators/products - Get all products for creator
router.get('/products', async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: products, error } = await supabase
      .from('creator_products')
      .select('*')
      .eq('creator_id', req.user.creator_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ products: products || [] });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/creators/products - Create a product
router.post('/products', validateRequest(createProductSchema), async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const productData = req.body;

    const { data: product, error } = await supabase
      .from('creator_products')
      .insert({
        creator_id: req.user.creator_id,
        ...productData,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/creators/products/:productId - Update a product
router.patch('/products/:productId', validateRequest(updateProductSchema), async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId } = req.params;
    const updates = req.body;

    const { data: product, error } = await supabase
      .from('creator_products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .eq('creator_id', req.user.creator_id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Product not found' });
      }
      throw error;
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/creators/products/:productId - Delete a product
router.delete('/products/:productId', async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId } = req.params;

    const { error } = await supabase
      .from('creator_products')
      .delete()
      .eq('id', productId)
      .eq('creator_id', req.user.creator_id);

    if (error) {
      throw error;
    }

    res.json({
      message: 'Product deleted successfully',
      id: productId,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/creators/products/:productId/tiers - Get pricing tiers for a product
router.get('/products/:productId/tiers', async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId } = req.params;

    // Verify product belongs to creator
    const { data: product, error: productError } = await supabase
      .from('creator_products')
      .select('id')
      .eq('id', productId)
      .eq('creator_id', req.user.creator_id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { data: tiers, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('product_id', productId)
      .order('price_amount', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({ tiers: tiers || [] });
  } catch (error) {
    console.error('Error fetching pricing tiers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/creators/products/:productId/tiers - Create a pricing tier
router.post('/products/:productId/tiers', validateRequest(createPricingTierSchema), async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId } = req.params;
    const tierData = req.body;

    // Verify product belongs to creator
    const { data: product, error: productError } = await supabase
      .from('creator_products')
      .select('id')
      .eq('id', productId)
      .eq('creator_id', req.user.creator_id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { data: tier, error } = await supabase
      .from('pricing_tiers')
      .insert({
        product_id: productId,
        ...tierData,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(tier);
  } catch (error) {
    console.error('Error creating pricing tier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/creators/products/:productId/tiers/:tierId - Update a pricing tier
router.patch('/products/:productId/tiers/:tierId', validateRequest(updatePricingTierSchema), async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId, tierId } = req.params;
    const updates = req.body;

    // Verify product belongs to creator
    const { data: product, error: productError } = await supabase
      .from('creator_products')
      .select('id')
      .eq('id', productId)
      .eq('creator_id', req.user.creator_id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { data: tier, error } = await supabase
      .from('pricing_tiers')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tierId)
      .eq('product_id', productId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Pricing tier not found' });
      }
      throw error;
    }

    res.json(tier);
  } catch (error) {
    console.error('Error updating pricing tier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/creators/products/:productId/tiers/:tierId - Delete a pricing tier
router.delete('/products/:productId/tiers/:tierId', async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId, tierId } = req.params;

    // Verify product belongs to creator
    const { data: product, error: productError } = await supabase
      .from('creator_products')
      .select('id')
      .eq('id', productId)
      .eq('creator_id', req.user.creator_id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { error } = await supabase
      .from('pricing_tiers')
      .delete()
      .eq('id', tierId)
      .eq('product_id', productId);

    if (error) {
      throw error;
    }

    res.json({
      message: 'Pricing tier deleted successfully',
      id: tierId,
    });
  } catch (error) {
    console.error('Error deleting pricing tier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as creatorRoutes };
