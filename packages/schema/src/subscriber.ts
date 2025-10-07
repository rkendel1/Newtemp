import { z } from 'zod';

// Subscriber schema (end-users of SaaS creators)
export const subscriberSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  email: z.string().email(),
  customer_name: z.string().optional(),
  stripe_customer_id: z.string().optional(),
  stripe_subscription_id: z.string().optional(),
  pricing_tier_id: z.string().uuid().optional(),
  subscription_status: z.enum(['active', 'canceled', 'past_due', 'trialing']),
  trial_ends_at: z.string().datetime().optional(),
  current_period_start: z.string().datetime().optional(),
  current_period_end: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Subscriber = z.infer<typeof subscriberSchema>;

// Usage metrics schema
export const usageMetricSchema = z.object({
  id: z.string().uuid(),
  subscriber_id: z.string().uuid(),
  product_id: z.string().uuid(),
  metric_name: z.string(),
  metric_value: z.number(),
  metric_unit: z.string().optional(),
  recorded_at: z.string().datetime(),
  created_at: z.string().datetime(),
});

export type UsageMetric = z.infer<typeof usageMetricSchema>;

// White-label configuration schema
export const whitelabelConfigSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  custom_domain: z.string().optional(),
  primary_color: z.string().default('#3b82f6'),
  secondary_color: z.string().default('#1e40af'),
  logo_url: z.string().url().optional(),
  company_name: z.string(),
  support_email: z.string().email().optional(),
  custom_css: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type WhitelabelConfig = z.infer<typeof whitelabelConfigSchema>;

// Input schemas
export const createSubscriberSchema = z.object({
  email: z.string().email(),
  customer_name: z.string().optional(),
  pricing_tier_id: z.string().uuid().optional(),
});

export const updateSubscriberSchema = createSubscriberSchema.partial();

export const recordUsageMetricSchema = z.object({
  metric_name: z.string(),
  metric_value: z.number(),
  metric_unit: z.string().optional(),
});

export const createWhitelabelConfigSchema = z.object({
  custom_domain: z.string().optional(),
  primary_color: z.string().default('#3b82f6'),
  secondary_color: z.string().default('#1e40af'),
  logo_url: z.string().url().optional(),
  company_name: z.string(),
  support_email: z.string().email().optional(),
  custom_css: z.string().optional(),
});

export const updateWhitelabelConfigSchema = createWhitelabelConfigSchema.partial();

export type CreateSubscriberInput = z.infer<typeof createSubscriberSchema>;
export type UpdateSubscriberInput = z.infer<typeof updateSubscriberSchema>;
export type RecordUsageMetricInput = z.infer<typeof recordUsageMetricSchema>;
export type CreateWhitelabelConfigInput = z.infer<typeof createWhitelabelConfigSchema>;
export type UpdateWhitelabelConfigInput = z.infer<typeof updateWhitelabelConfigSchema>;
