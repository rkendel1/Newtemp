export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    stack?: string;
  };
  message?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  created_at: string;
  updated_at: string;
}
