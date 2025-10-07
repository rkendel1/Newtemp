"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, ExternalLink, Settings, Trash2 } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  product_url: string;
  is_active: boolean;
  created_at: string;
}

export default function ProductsPage() {
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "My SaaS Product",
      description: "A great product for businesses",
      product_url: "https://example.com",
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your SaaS products and pricing
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/creator/products/new">
            <Plus size={18} className="mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Get started by creating your first SaaS product and setting up pricing tiers
            </p>
            <Button asChild>
              <Link href="/dashboard/creator/products/new">
                <Plus size={18} className="mr-2" />
                Create Your First Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle>{product.name}</CardTitle>
                      {product.is_active ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          Inactive
                        </span>
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      {product.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/creator/products/${product.id}/settings`}>
                        <Settings size={16} className="mr-2" />
                        Settings
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={product.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">URL:</span>{" "}
                    <a
                      href={product.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {product.product_url}
                    </a>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/creator/products/${product.id}/pricing`}>
                      Manage Pricing Tiers
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/creator/products/${product.id}/whitelabel`}>
                      White-Label Settings
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/creator/subscribers?product=${product.id}`}>
                      View Subscribers
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
