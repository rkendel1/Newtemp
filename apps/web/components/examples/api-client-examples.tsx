/**
 * Example: Using the API Client and React Hooks
 * 
 * This file demonstrates how to integrate the backend API
 * with frontend components using the provided utilities.
 */

'use client';

import { useState } from 'react';
import { useCreatorProfile, useProducts, useStripeConnect } from '@/utils/api-hooks';
import api from '@/utils/api-client';

/**
 * Example 1: Using React Hooks for Data Fetching
 */
export function CreatorProfileExample() {
  const { profile, loading, error, updateProfile } = useCreatorProfile();
  const [editing, setEditing] = useState(false);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await updateProfile({
        company_name: formData.get('company_name') as string,
        product_url: formData.get('product_url') as string,
      });
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Creator Profile</h2>
      
      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1">Company Name</label>
            <input
              name="company_name"
              defaultValue={profile.company_name}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Product URL</label>
            <input
              name="product_url"
              type="url"
              defaultValue={profile.product_url}
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <p><strong>Company:</strong> {profile.company_name}</p>
          <p><strong>URL:</strong> {profile.product_url}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Status:</strong> {profile.subscription_status}</p>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Managing Products with React Hooks
 */
export function ProductsListExample() {
  const { products, loading, error, createProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createProduct({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        product_url: formData.get('product_url') as string,
      });
      setShowForm(false);
      e.currentTarget.reset();
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      
      {loading && <div>Loading products...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      
      <div className="space-y-2 mb-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
            <button
              onClick={() => deleteProduct(product.id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <form onSubmit={handleCreate} className="space-y-4 border-t pt-4">
          <div>
            <label className="block mb-1">Product Name</label>
            <input
              name="name"
              required
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              className="border p-2 w-full rounded"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1">Product URL</label>
            <input
              name="product_url"
              type="url"
              required
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Create Product
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      )}
    </div>
  );
}

/**
 * Example 3: Direct API Client Usage
 */
export function SubscribersExample({ productId }: { productId: string }) {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const data: any = await api.subscribers.list(productId);
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error('Failed to load subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  const recordUsage = async (subscriberId: string) => {
    try {
      await api.usage.record(subscriberId, {
        metric_name: 'api_calls',
        metric_value: 1,
        metric_unit: 'calls',
      });
      alert('Usage recorded successfully!');
    } catch (err) {
      console.error('Failed to record usage:', err);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Subscribers</h2>
      
      <button
        onClick={loadSubscribers}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load Subscribers'}
      </button>

      <div className="space-y-2">
        {subscribers.map((subscriber) => (
          <div key={subscriber.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <p className="font-semibold">{subscriber.customer_name || subscriber.email}</p>
              <p className="text-sm text-gray-600">Status: {subscriber.subscription_status}</p>
            </div>
            <button
              onClick={() => recordUsage(subscriber.id)}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Record Usage
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 4: Stripe Connection
 */
export function StripeConnectExample() {
  const { connect, disconnect, loading, error } = useStripeConnect();

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Stripe Connection</h2>
      
      {error && <div className="text-red-500 mb-2">Error: {error}</div>}
      
      <div className="flex gap-2">
        <button
          onClick={connect}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Connecting...' : 'Connect Stripe'}
        </button>
        <button
          onClick={disconnect}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Disconnecting...' : 'Disconnect Stripe'}
        </button>
      </div>
    </div>
  );
}

/**
 * Example 5: Platform Owner - View Statistics
 */
export function PlatformStatsExample() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.platform.stats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      alert('You may not have Platform Owner permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Platform Statistics</h2>
      <p className="text-sm text-gray-600 mb-4">Platform Owner only</p>
      
      <button
        onClick={loadStats}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load Statistics'}
      </button>

      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Total Creators</p>
            <p className="text-2xl font-bold">{stats.total_creators}</p>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Active Creators</p>
            <p className="text-2xl font-bold">{stats.active_creators}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <p className="text-sm text-gray-600">Trial Creators</p>
            <p className="text-2xl font-bold">{stats.trial_creators}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{stats.total_products}</p>
          </div>
        </div>
      )}
    </div>
  );
}
