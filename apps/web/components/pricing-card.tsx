"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Check, Zap, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/styles";

interface Product {
  id: string;
  name: string;
  description: string;
  prices?: Array<{
    id: string;
    unit_amount: number;
    interval: "month" | "year" | "one-time";
    type: "recurring" | "one-time";
  }>;
}

interface PricingCardProps {
  product: Product;
  interval: "month" | "year" | "one-time";
}

export default function PricingCard({
  product,
  interval,
}: PricingCardProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Find the price for the selected interval
  const price = product.prices?.find(
    p => p.interval === interval || (p.type === "one-time" && interval === "one-time")
  );

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      // TODO: Replace with your checkout logic
      console.log("Checkout for product:", product.id, "price:", price?.id);
      
      // Example: Redirect to your checkout page
      // window.location.href = `/checkout?product=${product.id}&price=${price?.id}`;
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!price) {
    return null;
  }

  const isPopular = product.name.toLowerCase().includes("pro") || product.name.toLowerCase().includes("premium");

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md",
        isPopular && "border-primary shadow-lg"
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <Zap className="mr-1 h-3 w-3" />
            Most Popular
          </Badge>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          {product.description}
        </p>

        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">
              {formatPrice(price.unit_amount)}
            </span>
            {price.type === "recurring" && (
              <span className="text-muted-foreground ml-1">
                /{price.interval}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          className={cn(
            "w-full mb-6",
            isPopular && "bg-primary hover:bg-primary/90"
          )}
        >
          {checkoutLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Get Started
            </>
          )}
        </Button>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span>All core features included</span>
          </div>
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span>24/7 customer support</span>
          </div>
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}