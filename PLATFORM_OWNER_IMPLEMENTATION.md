# Platform Owner Role Implementation Notes

## Overview
This document describes the implementation of the Platform Owner role for the SaaS enablement platform. The Platform Owner role provides enhanced capabilities for managing the platform and all SaaS creators.

## Implementation Summary

### 1. Database Schema Changes

Added a `role` field to the `saas_creators` table:
```sql
role VARCHAR(50) DEFAULT 'saas_creator' CHECK (role IN ('platform_owner', 'saas_creator'))
```

Created a new `platform_settings` table:
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

### 2. Schema Package Updates

**File: `packages/schema/src/creator.ts`**

Added new schemas:
- `userRoleSchema` - Enum for 'platform_owner' and 'saas_creator'
- `platformSettingsSchema` - Schema for platform-wide settings
- `updatePlatformSettingsSchema` - Schema for updating platform settings

Updated `saasCreatorSchema` to include:
```typescript
role: userRoleSchema.default('saas_creator')
```

### 3. API Endpoints

**File: `apps/api/src/groups/platform.ts`** (NEW)

Created Platform Owner-only endpoints:
- `GET /api/platform/settings` - Get platform-wide settings
- `PATCH /api/platform/settings` - Update platform settings
- `GET /api/platform/creators` - List all SaaS creators (with pagination/filtering)
- `GET /api/platform/creators/:creatorId` - Get specific creator details
- `PATCH /api/platform/creators/:creatorId` - Update creator status
- `GET /api/platform/stats` - Get platform-wide statistics

**File: `apps/api/src/groups/creator.ts`** (UPDATED)

Updated creator creation endpoint to assign roles:
- First user to register gets 'platform_owner' role
- All subsequent users get 'saas_creator' role

Updated GET endpoint to return role field in response.

### 4. Middleware for Access Control

**File: `apps/api/src/middleware/role-check.ts`** (NEW)

Created middleware functions:
- `requirePlatformOwner` - Ensures only platform owners can access certain routes
- `requireCreator` - Ensures user has at least creator privileges
- `attachUserInfo` - Attaches user info and role to request object

### 5. User Interface

**Platform Owner Dashboard**

Created three new pages:

1. **Main Dashboard** - `/dashboard/platform-owner/page.tsx`
   - Displays platform-wide statistics
   - Shows quick action buttons
   - Displays platform owner badge

   Key metrics shown:
   - Total creators (with breakdown of active vs trial)
   - Total products across all creators
   - Total subscribers platform-wide
   - Monthly revenue from platform subscriptions

2. **Platform Settings** - `/dashboard/platform-owner/settings/page.tsx`
   - Configure platform subscription pricing
   - Set subscription currency
   - Choose billing interval (monthly/yearly)
   - Set trial period duration

   Features:
   - Form validation
   - Real-time price display
   - Save functionality (ready for API integration)

3. **Manage Creators** - `/dashboard/platform-owner/creators/page.tsx`
   - View all SaaS creators in a table
   - Filter by subscription status
   - Monitor onboarding completion
   - Track Stripe connection status
   - Update creator subscription status

   Table columns:
   - Company name
   - Product URL (clickable link)
   - Onboarding status (✓/✗)
   - Stripe connection status (✓/✗)
   - Subscription status (badge)
   - Created date
   - Actions (status dropdown)

### 6. Documentation Updates

**File: `SAAS_PLATFORM_SETUP.md`**

Added comprehensive documentation:
- Platform Owner role description
- Database schema updates
- New API endpoints
- Usage guide for Platform Owner
- Platform Owner capabilities

## Role Assignment Logic

The role assignment follows this logic:

1. When a user completes registration and creates a creator profile:
   - System checks if any creators exist in the database
   - If this is the first creator → assign 'platform_owner' role
   - If creators already exist → assign 'saas_creator' role

2. Role is stored in the `saas_creators` table

3. Role determines access to:
   - Platform-wide settings (Platform Owner only)
   - Creator management interface (Platform Owner only)
   - Platform statistics (Platform Owner only)
   - All SaaS Creator features (both roles)

## Platform Owner Capabilities

The Platform Owner has ALL capabilities of a SaaS Creator, PLUS:

### Exclusive Capabilities:
1. **Platform Settings Management**
   - Set subscription prices for the platform
   - Configure billing intervals
   - Adjust trial period durations
   - Update platform-wide configurations

2. **Creator Management**
   - View all SaaS creators
   - Monitor creator onboarding status
   - Track Stripe connections
   - Update creator subscription statuses
   - View creator details

3. **Platform Analytics**
   - Total creator count
   - Active vs trial creator breakdown
   - Platform-wide product count
   - Total subscriber count
   - Monthly revenue tracking

### Shared Capabilities (with SaaS Creators):
- Create and manage products
- Configure pricing tiers
- Manage subscribers
- Customize white-label portals
- Track usage metrics
- Process payments through Stripe

## Access Control

Access control is enforced at multiple levels:

1. **API Level**
   - Middleware checks user role from database
   - `requirePlatformOwner` middleware protects platform routes
   - Returns 403 Forbidden if non-owner tries to access

2. **UI Level**
   - Platform Owner pages only accessible via direct navigation
   - Role-based navigation can be added to show/hide links
   - Frontend assumes backend will enforce access control

3. **Future Enhancements**
   - Add role-based navigation menu
   - Add conditional rendering based on user role
   - Add role indicator in user profile

## API Integration Points

The following API calls need to be implemented in production:

### Creator Profile Creation
```typescript
POST /api/creators
{
  company_name: string,
  product_url?: string
}
// Backend will auto-assign role based on user count
```

### Get Current User Profile
```typescript
GET /api/creators/me
// Returns: { ..., role: 'platform_owner' | 'saas_creator' }
```

### Platform Settings (Platform Owner Only)
```typescript
GET /api/platform/settings
PATCH /api/platform/settings
{
  platform_subscription_price?: number,
  platform_subscription_currency?: string,
  platform_billing_interval?: 'month' | 'year',
  platform_trial_days?: number
}
```

### Creator Management (Platform Owner Only)
```typescript
GET /api/platform/creators?status=all|active|trial|canceled|past_due
GET /api/platform/creators/:creatorId
PATCH /api/platform/creators/:creatorId
{
  subscription_status: 'active' | 'trial' | 'canceled' | 'past_due'
}
```

### Platform Statistics (Platform Owner Only)
```typescript
GET /api/platform/stats
// Returns aggregate statistics
```

## Testing Checklist

To test this implementation:

- [ ] First user registration assigns platform_owner role
- [ ] Second user registration assigns saas_creator role
- [ ] Platform Owner can access /dashboard/platform-owner
- [ ] Platform Owner can access /dashboard/platform-owner/settings
- [ ] Platform Owner can access /dashboard/platform-owner/creators
- [ ] Platform Owner can view platform statistics
- [ ] Platform Owner can update platform settings
- [ ] Platform Owner can view all creators
- [ ] Platform Owner can update creator statuses
- [ ] SaaS Creator cannot access /api/platform/* endpoints (403 error)
- [ ] Role field is returned in /api/creators/me response
- [ ] Platform Owner has all SaaS Creator capabilities
- [ ] Database constraints prevent invalid role values

## Future Enhancements

Potential improvements for future iterations:

1. **Role Management UI**
   - Allow Platform Owner to promote users to Platform Owner
   - Allow Platform Owner to demote users to SaaS Creator
   - Add role change audit log

2. **Enhanced Analytics**
   - Revenue charts and graphs
   - Creator growth over time
   - Subscriber retention metrics
   - Churn analysis

3. **Notifications**
   - Alert Platform Owner of new creator signups
   - Notify on subscription status changes
   - Alert on payment failures

4. **Bulk Operations**
   - Bulk update creator statuses
   - Bulk export creator data
   - Batch notifications to creators

5. **Advanced Filtering**
   - Search creators by company name
   - Filter by Stripe connection status
   - Filter by onboarding completion
   - Date range filters

6. **Creator Insights**
   - Per-creator revenue breakdown
   - Product performance metrics
   - Subscriber growth per creator

## Migration Guide

To apply these changes to an existing database:

```sql
-- Add role column to existing saas_creators table
ALTER TABLE saas_creators 
ADD COLUMN role VARCHAR(50) DEFAULT 'saas_creator' 
CHECK (role IN ('platform_owner', 'saas_creator'));

-- Update first creator to platform_owner
UPDATE saas_creators 
SET role = 'platform_owner' 
WHERE id = (
  SELECT id FROM saas_creators 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Create platform_settings table
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_subscription_price INTEGER,
  platform_subscription_currency VARCHAR(10) DEFAULT 'USD',
  platform_billing_interval VARCHAR(50) DEFAULT 'month',
  platform_trial_days INTEGER DEFAULT 14,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default platform settings
INSERT INTO platform_settings (
  platform_subscription_price,
  platform_subscription_currency,
  platform_billing_interval,
  platform_trial_days
) VALUES (
  2900,  -- $29.00 in cents
  'USD',
  'month',
  14
);
```

## Notes

- All TODO comments in the code indicate where database integration is needed
- Mock data is used for demonstration purposes
- Authentication middleware integration is assumed but not implemented
- Actual Supabase/database queries need to be added
- Stripe integration for platform subscriptions needs to be implemented
