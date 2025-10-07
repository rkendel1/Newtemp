// Stripe configuration and utilities
export const STRIPE_CONFIG = {
  // Stripe API version
  apiVersion: '2024-11-20.acacia' as const,
  
  // OAuth URLs
  oauth: {
    authorizeUrl: 'https://connect.stripe.com/oauth/authorize',
    tokenUrl: 'https://connect.stripe.com/oauth/token',
    // Scopes needed for SaaS enablement platform
    scopes: ['read_write'],
  },
  
  // Webhook configuration
  webhooks: {
    events: [
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'invoice.payment_succeeded',
      'invoice.payment_failed',
      'checkout.session.completed',
    ],
  },
};

// Helper to build Stripe OAuth URL
export const buildStripeOAuthUrl = (params: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string => {
  const url = new URL(STRIPE_CONFIG.oauth.authorizeUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', params.clientId);
  url.searchParams.set('scope', STRIPE_CONFIG.oauth.scopes.join(' '));
  url.searchParams.set('redirect_uri', params.redirectUri);
  url.searchParams.set('state', params.state);
  return url.toString();
};

// Helper to format Stripe amounts (convert cents to dollars)
export const formatStripeAmount = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
};

// Helper to convert dollars to Stripe cents
export const toStripeAmount = (amount: number): number => {
  return Math.round(amount * 100);
};
