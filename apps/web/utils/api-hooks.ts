'use client';

import { useState, useEffect } from 'react';
import api from './api-client';

/**
 * Hook to fetch and manage creator profile
 */
export function useCreatorProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await api.creator.getMe();
        setProfile(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const updateProfile = async (updates: { company_name?: string; product_url?: string }) => {
    try {
      setLoading(true);
      const data = await api.creator.update(updates);
      setProfile(data);
      setError(null);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
}

/**
 * Hook to fetch and manage products
 */
export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data: any = await api.products.list();
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (productData: {
    name: string;
    description?: string;
    product_url: string;
    webhook_url?: string;
  }) => {
    try {
      const data = await api.products.create(productData);
      setProducts([...products, data]);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMsg);
      throw err;
    }
  };

  const updateProduct = async (productId: string, updates: any) => {
    try {
      const data = await api.products.update(productId, updates);
      setProducts(products.map(p => p.id === productId ? data : p));
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMsg);
      throw err;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await api.products.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMsg);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}

/**
 * Hook to fetch and manage platform statistics (Platform Owner only)
 */
export function usePlatformStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.platform.stats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}

/**
 * Hook to manage Stripe connection
 */
export function useStripeConnect() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: any = await api.stripe.connect();
      window.location.href = data.authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Stripe');
      setLoading(false);
      throw err;
    }
  };

  const disconnect = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.stripe.disconnect();
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect Stripe');
      setLoading(false);
      throw err;
    }
  };

  return { connect, disconnect, loading, error };
}
