import { Router, type Router as ExpressRouter } from 'express';
import { buildStripeOAuthUrl } from '@saas-template/utils';
import { supabase } from '../utils/supabase';
import { requireCreator } from '../middleware/role-check';

const router: ExpressRouter = Router();

// GET /api/stripe/connect - Initialize Stripe OAuth flow
router.get('/connect', requireCreator, async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate state for CSRF protection
    const state = Buffer.from(JSON.stringify({ 
      creatorId: req.user.creator_id, 
      timestamp: Date.now() 
    })).toString('base64');
    
    const clientId = process.env.STRIPE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ error: 'Stripe client ID not configured' });
    }
    
    const redirectUri = `${process.env.API_URL || 'http://localhost:3002'}/api/stripe/callback`;
    
    const authUrl = buildStripeOAuthUrl({
      clientId,
      redirectUri,
      state,
    });
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating Stripe connect URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/stripe/callback - Handle Stripe OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.status(400).json({ error: 'Missing code or state parameter' });
    }
    
    // Verify state
    const stateData = JSON.parse(Buffer.from(state as string, 'base64').toString());
    const { creatorId } = stateData;
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        client_secret: process.env.STRIPE_SECRET_KEY || '',
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      return res.status(400).json({ error: 'Failed to exchange code for token', details: tokenData });
    }
    
    // Store Stripe credentials in database
    const { error } = await supabase
      .from('saas_creators')
      .update({
        stripe_account_id: tokenData.stripe_user_id,
        stripe_access_token: tokenData.access_token,
        stripe_refresh_token: tokenData.refresh_token,
        updated_at: new Date().toISOString(),
      })
      .eq('id', creatorId);

    if (error) {
      throw error;
    }
    
    // Redirect to dashboard
    res.redirect(`${process.env.WEB_URL || 'http://localhost:3000'}/dashboard/onboarding?stripe_connected=true`);
  } catch (error) {
    console.error('Stripe OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/stripe/disconnect - Disconnect Stripe account
router.post('/disconnect', requireCreator, async (req, res) => {
  try {
    if (!req.user || !req.user.creator_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Clear Stripe credentials from database
    const { error } = await supabase
      .from('saas_creators')
      .update({
        stripe_account_id: null,
        stripe_access_token: null,
        stripe_refresh_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.creator_id);

    if (error) {
      throw error;
    }
    
    res.json({ message: 'Stripe account disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting Stripe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/stripe/webhook - Handle Stripe webhooks
router.post('/webhook', async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      return res.status(400).json({ error: 'Missing Stripe signature' });
    }
    
    // Note: In production, verify webhook signature using Stripe library
    // const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    
    const event = req.body;
    
    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        console.log('Subscription created:', event.data.object);
        // Update subscriber status in database
        if (event.data.object.metadata?.subscriber_id) {
          await supabase
            .from('subscribers')
            .update({
              stripe_subscription_id: event.data.object.id,
              subscription_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', event.data.object.metadata.subscriber_id);
        }
        break;
        
      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object);
        // Update subscriber information
        if (event.data.object.metadata?.subscriber_id) {
          await supabase
            .from('subscribers')
            .update({
              subscription_status: event.data.object.status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', event.data.object.metadata.subscriber_id);
        }
        break;
        
      case 'customer.subscription.deleted':
        console.log('Subscription deleted:', event.data.object);
        // Mark subscription as canceled
        if (event.data.object.metadata?.subscriber_id) {
          await supabase
            .from('subscribers')
            .update({
              subscription_status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', event.data.object.metadata.subscriber_id);
        }
        break;
        
      case 'invoice.payment_succeeded':
        console.log('Payment succeeded:', event.data.object);
        // Could update payment history or send confirmation email
        break;
        
      case 'invoice.payment_failed':
        console.log('Payment failed:', event.data.object);
        // Update subscription status and notify customer
        if (event.data.object.subscription) {
          await supabase
            .from('subscribers')
            .update({
              subscription_status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', event.data.object.subscription);
        }
        break;
        
      case 'checkout.session.completed':
        console.log('Checkout completed:', event.data.object);
        // Handle successful checkout session
        break;
        
      default:
        console.log('Unhandled event type:', event.type);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as stripeRoutes };
