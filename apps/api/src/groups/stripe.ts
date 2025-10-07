import { Router, type Router as ExpressRouter } from 'express';
import { buildStripeOAuthUrl } from '@saas-template/utils';

const router: ExpressRouter = Router();

// GET /api/stripe/connect - Initialize Stripe OAuth flow
router.get('/connect', async (req, res) => {
  try {
    // TODO: Get creator_id from auth token
    const creatorId = '1'; // Mock creator ID
    
    // Generate state for CSRF protection
    const state = Buffer.from(JSON.stringify({ 
      creatorId, 
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
    
    // TODO: Store Stripe credentials in database
    // {
    //   stripe_account_id: tokenData.stripe_user_id,
    //   stripe_access_token: tokenData.access_token,
    //   stripe_refresh_token: tokenData.refresh_token,
    // }
    
    // Redirect to dashboard
    res.redirect(`${process.env.WEB_URL || 'http://localhost:3000'}/dashboard/onboarding?stripe_connected=true`);
  } catch (error) {
    console.error('Stripe OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/stripe/disconnect - Disconnect Stripe account
router.post('/disconnect', async (req, res) => {
  try {
    // TODO: Get creator_id from auth token
    const creatorId = '1'; // Mock creator ID
    
    // TODO: Revoke Stripe access and clear credentials from database
    
    res.json({ message: 'Stripe account disconnected successfully' });
  } catch (error) {
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
    
    // TODO: Verify webhook signature using Stripe library
    // const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    
    const event = req.body;
    
    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        // TODO: Handle new subscription
        console.log('Subscription created:', event.data.object);
        break;
        
      case 'customer.subscription.updated':
        // TODO: Handle subscription update
        console.log('Subscription updated:', event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        // TODO: Handle subscription cancellation
        console.log('Subscription deleted:', event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        // TODO: Handle successful payment
        console.log('Payment succeeded:', event.data.object);
        break;
        
      case 'invoice.payment_failed':
        // TODO: Handle failed payment
        console.log('Payment failed:', event.data.object);
        break;
        
      case 'checkout.session.completed':
        // TODO: Handle completed checkout
        console.log('Checkout completed:', event.data.object);
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
