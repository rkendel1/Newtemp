# SaaS Enablement Platform - Setup Guide

This guide will help you set up and configure the SaaS enablement platform features.

## Overview

The SaaS enablement platform allows SaaS creators to:
- Onboard quickly by providing their Stripe account and product details
- Manage products, pricing tiers, and subscriptions
- Create white-label subscriber portals
- Track usage metrics and manage subscribers
- Process payments through Stripe

## Architecture

### Key Components

1. **Creator Dashboard** (`/dashboard/creator`)
   - Product management
   - Pricing tier configuration
   - Subscriber management
   - Usage analytics

2. **Onboarding Flow** (`/dashboard/onboarding`)
   - Company profile setup
   - Product configuration
   - Stripe OAuth connection

3. **White-Label Portal** (`/portal/[productId]`)
   - Branded subscriber experience
   - Subscription management
   - Usage tracking

4. **API Endpoints** (`apps/api/src/groups/`)
   - Creator management (`/api/creators`)
   - Product CRUD (`/api/creators/products`)
   - Pricing tiers (`/api/creators/products/:id/tiers`)
   - Subscriber management (`/api/subscribers`)
   - Stripe integration (`/api/stripe`)
   - Platform owner management (`/api/platform`) - Platform Owner only

## Environment Setup

### Required Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_CLIENT_ID=ca_...
STRIPE_WEBHOOK_SECRET=whsec_...

# API Configuration
API_URL=http://localhost:3002
WEB_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Stripe Setup

1. **Create a Stripe Account**
   - Go to https://stripe.com and sign up
   - Complete your account setup

2. **Get API Keys**
   - Navigate to Developers > API keys
   - Copy your publishable and secret keys

3. **Configure OAuth**
   - Go to Settings > Connect > Integration
   - Add redirect URI: `http://localhost:3002/api/stripe/callback`
   - Get your client ID

4. **Set Up Webhooks**
   - Go to Developers > Webhooks
   - Add endpoint: `http://localhost:3002/api/stripe/webhook`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `checkout.session.completed`
   - Copy the webhook secret

### Database Schema

The platform requires the following database tables:

#### saas_creators
```sql
CREATE TABLE saas_creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  company_name VARCHAR(255) NOT NULL,
  product_url TEXT,
  stripe_account_id VARCHAR(255),
  stripe_access_token TEXT,
  stripe_refresh_token TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  subscription_status VARCHAR(50) DEFAULT 'trial',
  role VARCHAR(50) DEFAULT 'saas_creator' CHECK (role IN ('platform_owner', 'saas_creator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Note:** The first user to register will be assigned the `platform_owner` role automatically. All subsequent users will be assigned the `saas_creator` role.

#### creator_products
```sql
CREATE TABLE creator_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES saas_creators(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  product_url TEXT NOT NULL,
  webhook_url TEXT,
  api_key VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### pricing_tiers
```sql
CREATE TABLE pricing_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES creator_products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_amount INTEGER NOT NULL,
  price_currency VARCHAR(10) DEFAULT 'USD',
  billing_interval VARCHAR(50) NOT NULL,
  stripe_price_id VARCHAR(255),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### subscribers
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES creator_products(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  pricing_tier_id UUID REFERENCES pricing_tiers(id),
  subscription_status VARCHAR(50) NOT NULL,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### usage_metrics
```sql
CREATE TABLE usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES creator_products(id) ON DELETE CASCADE,
  metric_name VARCHAR(255) NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit VARCHAR(50),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### whitelabel_configs
```sql
CREATE TABLE whitelabel_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES creator_products(id) ON DELETE CASCADE,
  custom_domain VARCHAR(255),
  primary_color VARCHAR(50) DEFAULT '#3b82f6',
  secondary_color VARCHAR(50) DEFAULT '#1e40af',
  logo_url TEXT,
  company_name VARCHAR(255) NOT NULL,
  support_email VARCHAR(255),
  custom_css TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id)
);
```

#### platform_settings
```sql
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_subscription_price INTEGER,
  platform_subscription_currency VARCHAR(10) DEFAULT 'USD',
  platform_billing_interval VARCHAR(50) DEFAULT 'month',
  platform_trial_days INTEGER DEFAULT 14,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Note:** This table stores platform-wide settings that can only be managed by the Platform Owner.

## Usage Guide

### For Platform Owner

The first user to register on the platform is automatically assigned the Platform Owner role.

1. **Access Platform Owner Dashboard**
   - Navigate to `/dashboard/platform-owner`
   - View platform-wide statistics
   - Monitor all SaaS creators

2. **Manage Platform Settings**
   - Go to `/dashboard/platform-owner/settings`
   - Set subscription prices for the platform
   - Configure billing intervals and trial periods
   - Update platform-wide configurations

3. **Manage SaaS Creators**
   - Access `/dashboard/platform-owner/creators`
   - View all registered SaaS creators
   - Monitor their onboarding status
   - Update creator subscription status
   - Track Stripe connection status

4. **Platform Owner Capabilities**
   - All capabilities of a SaaS Creator (create products, manage pricing, etc.)
   - Exclusive access to platform-wide settings
   - Ability to view and manage all creators on the platform
   - Access to platform-wide analytics and statistics

### For SaaS Creators

1. **Sign Up and Onboarding**
   - Visit `/sign-up` to create an account
   - Complete the onboarding wizard at `/dashboard/onboarding`
   - Provide company name and product URL
   - Connect your Stripe account via OAuth

2. **Create Products**
   - Navigate to `/dashboard/creator/products`
   - Click "Add Product"
   - Enter product details and save

3. **Set Up Pricing Tiers**
   - Go to product settings
   - Click "Manage Pricing Tiers"
   - Create tiers with pricing and features

4. **Customize White-Label Portal**
   - Access white-label settings
   - Configure colors, logo, and branding
   - Set custom domain (optional)

5. **Manage Subscribers**
   - View all subscribers at `/dashboard/creator/subscribers`
   - Monitor subscription status
   - Track usage metrics

### For Subscribers

1. **Access Portal**
   - Visit `/portal/[productId]`
   - View available pricing plans
   - Subscribe to a plan

2. **Manage Subscription**
   - Sign in to subscriber portal
   - View current plan and usage
   - Upgrade or cancel subscription

## API Reference

### Creator Endpoints

- `GET /api/creators/me` - Get creator profile
- `POST /api/creators` - Create creator profile
- `PATCH /api/creators/me` - Update creator profile

### Product Endpoints

- `GET /api/creators/products` - List all products
- `POST /api/creators/products` - Create product
- `PATCH /api/creators/products/:id` - Update product
- `DELETE /api/creators/products/:id` - Delete product

### Pricing Tier Endpoints

- `GET /api/creators/products/:id/tiers` - List pricing tiers
- `POST /api/creators/products/:id/tiers` - Create tier
- `PATCH /api/creators/products/:id/tiers/:tierId` - Update tier
- `DELETE /api/creators/products/:id/tiers/:tierId` - Delete tier

### Subscriber Endpoints

- `GET /api/subscribers?product_id=:id` - List subscribers
- `POST /api/subscribers` - Create subscriber
- `GET /api/subscribers/:id` - Get subscriber details
- `PATCH /api/subscribers/:id` - Update subscriber

### Usage Metrics Endpoints

- `POST /api/subscribers/:id/usage` - Record usage
- `GET /api/subscribers/:id/usage` - Get usage metrics

### Stripe Endpoints

- `GET /api/stripe/connect` - Get OAuth URL
- `GET /api/stripe/callback` - OAuth callback
- `POST /api/stripe/disconnect` - Disconnect account
- `POST /api/stripe/webhook` - Webhook handler

### Platform Owner Endpoints

**Note:** All endpoints in this section require Platform Owner role.

- `GET /api/platform/settings` - Get platform settings
- `PATCH /api/platform/settings` - Update platform settings
- `GET /api/platform/creators` - Get all SaaS creators (with pagination and filtering)
- `GET /api/platform/creators/:creatorId` - Get specific creator details
- `PATCH /api/platform/creators/:creatorId` - Update creator status
- `GET /api/platform/stats` - Get platform-wide statistics

## Development

### Running the Platform

```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Start specific services
pnpm dev:api   # API on port 3002
pnpm dev:web   # Web on port 3000
```

### Building

```bash
# Build all packages and apps
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Testing

### Stripe Test Mode

When using Stripe test mode, you can use test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Webhook Testing

Use Stripe CLI to forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3002/api/stripe/webhook
```

## Deployment

See main README for deployment instructions to Fly.io.

### Additional Configuration

For production, ensure:
1. Stripe live mode keys are configured
2. Webhook endpoints are updated
3. OAuth redirect URIs are updated
4. Database is properly secured
5. Environment variables are set

## Support

For issues or questions:
- Check the documentation
- Review API endpoint examples
- Test with Stripe test mode first
