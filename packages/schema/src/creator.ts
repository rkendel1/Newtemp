import { z } from 'zod';

// SaaS Creator schema
export const saasCreatorSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  company_name: z.string().min(1).max(255),
  product_url: z.string().url().optional(),
  stripe_account_id: z.string().optional(),
  stripe_access_token: z.string().optional(),
  stripe_refresh_token: z.string().optional(),
  onboarding_completed: z.boolean().default(false),
  subscription_status: z.enum(['trial', 'active', 'canceled', 'past_due']).default('trial'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type SaasCreator = z.infer<typeof saasCreatorSchema>;

// Creator product/service schema
export const creatorProductSchema = z.object({
  id: z.string().uuid(),
  creator_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  product_url: z.string().url(),
  webhook_url: z.string().url().optional(),
  api_key: z.string().optional(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type CreatorProduct = z.infer<typeof creatorProductSchema>;

// Pricing tier schema
export const pricingTierSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price_amount: z.number().min(0),
  price_currency: z.string().default('USD'),
  billing_interval: z.enum(['month', 'year', 'one-time']),
  stripe_price_id: z.string().optional(),
  features: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type PricingTier = z.infer<typeof pricingTierSchema>;

// Create/Update input schemas
export const createCreatorSchema = z.object({
  company_name: z.string().min(1).max(255),
  product_url: z.string().url().optional(),
});

export const updateCreatorSchema = createCreatorSchema.partial();

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  product_url: z.string().url(),
  webhook_url: z.string().url().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createPricingTierSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price_amount: z.number().min(0),
  price_currency: z.string().default('USD'),
  billing_interval: z.enum(['month', 'year', 'one-time']),
  features: z.array(z.string()).default([]),
});

export const updatePricingTierSchema = createPricingTierSchema.partial();

export type CreateCreatorInput = z.infer<typeof createCreatorSchema>;
export type UpdateCreatorInput = z.infer<typeof updateCreatorSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreatePricingTierInput = z.infer<typeof createPricingTierSchema>;
export type UpdatePricingTierInput = z.infer<typeof updatePricingTierSchema>;
