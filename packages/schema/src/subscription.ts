import { z } from 'zod';

export const subscriptionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  plan: z.enum(['free', 'pro', 'enterprise']),
  status: z.enum(['active', 'canceled', 'past_due']),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
