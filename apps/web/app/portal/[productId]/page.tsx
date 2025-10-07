"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";

interface WhitelabelConfig {
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  company_name: string;
  support_email?: string;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price_amount: number;
  price_currency: string;
  billing_interval: string;
  features: string[];
  is_active: boolean;
}

export default function SubscriberPortalPage() {
  const params = useParams();
  const productId = params.productId as string;
  
  const [config, setConfig] = useState<WhitelabelConfig>({
    primary_color: "#3b82f6",
    secondary_color: "#1e40af",
    company_name: "SaaS Product",
  });
  
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    {
      id: "1",
      name: "Starter",
      description: "Perfect for getting started",
      price_amount: 999,
      price_currency: "USD",
      billing_interval: "month",
      features: ["Up to 100 users", "Basic features", "Email support"],
      is_active: true,
    },
    {
      id: "2",
      name: "Pro",
      description: "For growing businesses",
      price_amount: 2999,
      price_currency: "USD",
      billing_interval: "month",
      features: ["Unlimited users", "Advanced features", "Priority support", "API access"],
      is_active: true,
    },
  ]);

  useEffect(() => {
    // TODO: Fetch white-label config and pricing tiers from API
  }, [productId]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-background to-background/80"
      style={{ 
        // Apply custom colors from white-label config
        // @ts-ignore
        "--primary": config.primary_color 
      }}
    >
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {config.logo_url && (
                <img src={config.logo_url} alt={config.company_name} className="h-8" />
              )}
              <h1 className="text-2xl font-bold">{config.company_name}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your needs. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingTiers.filter(tier => tier.is_active).map((tier) => (
              <Card key={tier.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {formatPrice(tier.price_amount)}
                    </span>
                    <span className="text-muted-foreground">
                      /{tier.billing_interval}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">
                    <CreditCard size={18} className="mr-2" />
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 {config.company_name}. All rights reserved.
            </p>
            {config.support_email && (
              <a
                href={`mailto:${config.support_email}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Support: {config.support_email}
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
