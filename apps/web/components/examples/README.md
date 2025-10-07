# API Client Usage Examples

This directory contains example components demonstrating how to use the API client and React hooks to integrate the backend API with frontend components.

## Available Examples

### 1. CreatorProfileExample
Demonstrates using the `useCreatorProfile()` hook to:
- Fetch and display creator profile
- Edit profile with inline form
- Handle loading and error states

```tsx
import { CreatorProfileExample } from '@/components/examples/api-client-examples';

<CreatorProfileExample />
```

### 2. ProductsListExample
Shows how to use the `useProducts()` hook to:
- List all products
- Create new products
- Delete products
- Handle optimistic updates

```tsx
import { ProductsListExample } from '@/components/examples/api-client-examples';

<ProductsListExample />
```

### 3. SubscribersExample
Demonstrates direct API client usage (without hooks) to:
- Load subscribers for a product
- Record usage metrics
- Manage state manually

```tsx
import { SubscribersExample } from '@/components/examples/api-client-examples';

<SubscribersExample productId="your-product-id" />
```

### 4. StripeConnectExample
Shows Stripe integration using the `useStripeConnect()` hook:
- Connect Stripe account (redirects to OAuth)
- Disconnect Stripe account
- Handle loading states

```tsx
import { StripeConnectExample } from '@/components/examples/api-client-examples';

<StripeConnectExample />
```

### 5. PlatformStatsExample
Platform Owner only example showing how to:
- Fetch platform-wide statistics
- Display metrics in a dashboard
- Handle permission errors

```tsx
import { PlatformStatsExample } from '@/components/examples/api-client-examples';

<PlatformStatsExample />
```

## Using in Your Components

### Option 1: Using React Hooks (Recommended)

```tsx
'use client';

import { useProducts } from '@/utils/api-hooks';

export function MyComponent() {
  const { products, loading, error, createProduct } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Option 2: Direct API Client Usage

```tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api-client';

export function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.creator.getMe().then(setData);
  }, []);

  return <div>{data?.company_name}</div>;
}
```

### Option 3: Server Actions

```tsx
'use server';

import api from '@/utils/api-client';

export async function serverAction() {
  const profile = await api.creator.getMe();
  return profile;
}
```

## Available Hooks

- `useCreatorProfile()` - Manage creator profile
- `useProducts()` - Manage products
- `usePlatformStats()` - Get platform statistics (Platform Owner only)
- `useStripeConnect()` - Manage Stripe connection

## API Client Methods

See `apps/web/utils/api-client.ts` for the complete list of available methods:

- `api.auth.*` - Authentication
- `api.creator.*` - Creator profile
- `api.products.*` - Product management
- `api.pricingTiers.*` - Pricing tier management
- `api.subscribers.*` - Subscriber management
- `api.usage.*` - Usage metrics
- `api.whitelabel.*` - White-label configuration
- `api.platform.*` - Platform management (Platform Owner only)
- `api.stripe.*` - Stripe integration
- `api.user.*` - User profile
- `api.subscriptions.*` - Platform subscriptions

## Error Handling

All API methods throw errors that should be caught:

```tsx
try {
  const product = await api.products.create({ ... });
} catch (error) {
  console.error('Failed to create product:', error);
  // Show error to user
}
```

Hooks handle errors automatically and expose them via the `error` state:

```tsx
const { error } = useProducts();
if (error) {
  return <div>Error: {error}</div>;
}
```

## Authentication

The API client automatically attaches JWT tokens from Supabase to all requests. Make sure users are authenticated before using the API:

```tsx
import { createSupabaseClient } from '@/utils/supabase/client';

const supabase = createSupabaseClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  // Redirect to sign in
}
```

## TypeScript Support

All API methods and hooks are fully typed. Use TypeScript for better autocomplete and type safety:

```tsx
import type { Product, Creator } from '@saas-template/schema';

const products: Product[] = await api.products.list();
```
