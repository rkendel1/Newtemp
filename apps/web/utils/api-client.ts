/**
 * API Client for communicating with the backend API
 * Handles authentication and API requests
 */

import { createSupabaseClient } from './supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

/**
 * Get authentication token from Supabase
 */
async function getAuthToken(): Promise<string | null> {
  const supabase = createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge any existing headers
  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API client methods
export const api = {
  // Authentication
  auth: {
    signIn: async (email: string, password: string) => {
      const supabase = createSupabaseClient();
      return supabase.auth.signInWithPassword({ email, password });
    },
    signUp: async (email: string, password: string) => {
      const supabase = createSupabaseClient();
      return supabase.auth.signUp({ email, password });
    },
    signOut: async () => {
      const supabase = createSupabaseClient();
      return supabase.auth.signOut();
    },
  },

  // Creator profile
  creator: {
    getMe: () => apiRequest('/api/creators/me'),
    create: (data: { company_name: string; product_url?: string }) =>
      apiRequest('/api/creators', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (data: { company_name?: string; product_url?: string }) =>
      apiRequest('/api/creators/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Products
  products: {
    list: () => apiRequest('/api/creators/products'),
    create: (data: {
      name: string;
      description?: string;
      product_url: string;
      webhook_url?: string;
    }) =>
      apiRequest('/api/creators/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (productId: string, data: any) =>
      apiRequest(`/api/creators/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (productId: string) =>
      apiRequest(`/api/creators/products/${productId}`, {
        method: 'DELETE',
      }),
  },

  // Pricing tiers
  pricingTiers: {
    list: (productId: string) =>
      apiRequest(`/api/creators/products/${productId}/tiers`),
    create: (productId: string, data: any) =>
      apiRequest(`/api/creators/products/${productId}/tiers`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (productId: string, tierId: string, data: any) =>
      apiRequest(`/api/creators/products/${productId}/tiers/${tierId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (productId: string, tierId: string) =>
      apiRequest(`/api/creators/products/${productId}/tiers/${tierId}`, {
        method: 'DELETE',
      }),
  },

  // Subscribers
  subscribers: {
    list: (productId: string) =>
      apiRequest(`/api/subscribers?product_id=${productId}`),
    get: (subscriberId: string) =>
      apiRequest(`/api/subscribers/${subscriberId}`),
    create: (productId: string, data: any) =>
      apiRequest(`/api/subscribers?product_id=${productId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (subscriberId: string, data: any) =>
      apiRequest(`/api/subscribers/${subscriberId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Usage metrics
  usage: {
    record: (subscriberId: string, data: any) =>
      apiRequest(`/api/subscribers/${subscriberId}/usage`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    list: (subscriberId: string, params?: { start_date?: string; end_date?: string }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      return apiRequest(`/api/subscribers/${subscriberId}/usage?${queryParams}`);
    },
  },

  // White-label config
  whitelabel: {
    get: (productId: string) =>
      apiRequest(`/api/subscribers/whitelabel/${productId}`),
    create: (productId: string, data: any) =>
      apiRequest(`/api/subscribers/whitelabel/${productId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (productId: string, data: any) =>
      apiRequest(`/api/subscribers/whitelabel/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Platform (Platform Owner only)
  platform: {
    settings: {
      get: () => apiRequest('/api/platform/settings'),
      update: (data: any) =>
        apiRequest('/api/platform/settings', {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
    },
    creators: {
      list: (params?: { page?: number; limit?: number; status?: string }) => {
        const queryParams = new URLSearchParams(params as any).toString();
        return apiRequest(`/api/platform/creators?${queryParams}`);
      },
      get: (creatorId: string) =>
        apiRequest(`/api/platform/creators/${creatorId}`),
      update: (creatorId: string, data: { subscription_status: string }) =>
        apiRequest(`/api/platform/creators/${creatorId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
    },
    stats: () => apiRequest('/api/platform/stats'),
  },

  // Stripe
  stripe: {
    connect: () => apiRequest('/api/stripe/connect'),
    disconnect: () =>
      apiRequest('/api/stripe/disconnect', {
        method: 'POST',
      }),
  },

  // User profile
  user: {
    getProfile: () => apiRequest('/api/users/profile'),
    updateProfile: (data: { email: string }) =>
      apiRequest('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Subscriptions
  subscriptions: {
    get: () => apiRequest('/api/subscriptions'),
    upgrade: (plan: string) =>
      apiRequest('/api/subscriptions/upgrade', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      }),
    cancel: () =>
      apiRequest('/api/subscriptions/cancel', {
        method: 'POST',
      }),
  },
};

export default api;
