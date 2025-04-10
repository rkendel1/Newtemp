"use client";

import { Button } from "@/components/ui/button";
import { ProductWithPrices, Subscription } from "@updatedev/js";
import { createClient } from "@/utils/update/client";
import { useState } from "react";
import { Loader2, Check, Zap, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/styles";

interface PricingCardProps {
  product: ProductWithPrices;
  isCurrentPlan: boolean;
  interval: "month" | "year" | "one-time";
  currentSubscription?: Subscription | null;
}

export default function PricingCard({
  product,
  isCurrentPlan,
  interval,
  currentSubscription,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  function getCurrencySymbol(currency_id: string) {
    // This is just an example, and doesn't cover all currencies
    // supported by Update
    switch (currency_id) {
      case "usd":
        return "$";
      case "eur":
        return "€";
      case "gbp":
        return "£";
      case "cad":
        return "$";
      case "aud":
        return "$";
      default:
        return currency_id;
    }
  }

  async function handleSelectPlan(priceId: string) {
    setIsLoading(true);
    const client = createClient();
    const redirectUrl = `${window.location.origin}/protected/subscription`;
    const { data, error } = await client.billing.createCheckoutSession(
      priceId,
      {
        redirect_url: redirectUrl,
      }
    );
    if (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(false);
      return;
    }

    window.location.href = data.url;
  }
  
  async function handleCancelSubscription() {
    if (!currentSubscription) return;
    
    try {
      setActionLoading(true);
      const client = createClient();
      await client.billing.updateSubscription(currentSubscription.id, {
        cancel_at_period_end: true,
      });
      
      // Force a full page reload instead of just refreshing the router
      // This ensures all components update their state immediately
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      setActionLoading(false);
    }
    // No need for finally block as we're reloading the page
  }

  async function handleReactivateSubscription() {
    if (!currentSubscription) return;
    
    try {
      setActionLoading(true);
      const client = createClient();
      await client.billing.updateSubscription(currentSubscription.id, {
        cancel_at_period_end: false,
      });
      
      // Force a full page reload instead of just refreshing the router
      // This ensures all components update their state immediately
      window.location.reload();
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      setActionLoading(false);
    }
    // No need for finally block as we're reloading the page
  }

  const productPrice = product.prices?.find(
    price =>
      price.interval === interval ||
      (price.type === "one-time" && interval === "one-time")
  );

  if (!productPrice) {
    return null;
  }

  const { name, description } = product;

  const currency = productPrice.currency;
  const symbol = getCurrencySymbol(currency);
  const priceString = productPrice.unit_amount
    ? `${symbol}${(productPrice.unit_amount / 100).toFixed(2)}`
    : "Custom";
    
  const isPendingCancellation = isCurrentPlan && currentSubscription?.cancel_at_period_end;
  // Determine if this is an upgrade or downgrade from current plan
  const isUpgrade = isCurrentPlan ? false : 
    currentSubscription && productPrice.unit_amount && currentSubscription.price.unit_amount && 
    productPrice.unit_amount > currentSubscription.price.unit_amount;
  const isDowngrade = isCurrentPlan ? false : 
    currentSubscription && productPrice.unit_amount && currentSubscription.price.unit_amount && 
    productPrice.unit_amount < currentSubscription.price.unit_amount;

  // Get features based on product name/type
  const getFeatures = () => {
    // Default features all plans have
    const defaultFeatures = [
      "User authentication",
      "Account management",
      "Email notifications"
    ];
    
    // Add features based on plan name/type
    if (name.toLowerCase().includes("basic") || productPrice.unit_amount === 0) {
      return [
        ...defaultFeatures,
        "Limited storage (1GB)",
        "Community support"
      ];
    } else if (name.toLowerCase().includes("pro") || name.toLowerCase().includes("premium")) {
      return [
        ...defaultFeatures,
        "Extended storage (10GB)",
        "Priority support",
        "API access",
        "Advanced analytics",
        "Custom branding"
      ];
    } else if (name.toLowerCase().includes("team") || name.toLowerCase().includes("enterprise")) {
      return [
        ...defaultFeatures,
        "Unlimited storage",
        "24/7 priority support",
        "Advanced API access",
        "Team management",
        "Dedicated account manager",
        "SSO integration",
        "Custom reporting"
      ];
    }
    
    // Fallback for unknown plans
    return [
      ...defaultFeatures,
      "Standard features",
      "Email support"
    ];
  };
  
  const features = getFeatures();

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-200 bg-card flex flex-col h-full",
        isCurrentPlan 
          ? "border border-primary/50 shadow-md dark:shadow-primary/10" 
          : "border border-border hover:border-primary/50 hover:shadow-sm"
      )}
    >
      {/* Highlight strip for current plan */}
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
      )}

      {/* Plan Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{name}</h3>
          {isCurrentPlan && (
            <Badge variant="default" className="ml-2">
              Current Plan
            </Badge>
          )}
        </div>
        
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-3xl font-bold">{priceString}</span>
          {productPrice?.unit_amount && (
            <span className="text-muted-foreground text-sm">
              {interval !== "one-time" ? `/${interval}` : ""}
              {interval !== "one-time" && productPrice.interval_count !== 1 && 
                ` (${productPrice.interval_count} ${productPrice.interval}s)`}
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">{description || "Access premium features with this plan"}</p>
        
        {/* Features List */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check size={16} className="mr-2 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Plan Actions */}
      <div className="p-6 pt-4 border-t border-border bg-muted/30 mt-auto">
        {isCurrentPlan ? (
          <div className="space-y-3">
            {isPendingCancellation ? (
              <Button
                className="w-full"
                onClick={handleReactivateSubscription}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Zap size={16} className="mr-2" />
                )}
                Reactivate Subscription
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleCancelSubscription}
                variant="outline"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : null}
                Cancel Subscription
              </Button>
            )}
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => handleSelectPlan(productPrice.id)}
            disabled={isLoading}
            variant={isUpgrade ? "default" : isDowngrade ? "outline" : "default"}
          >
            {isLoading ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <CreditCard size={16} className="mr-2" />
            )}
            {isUpgrade ? "Upgrade" : isDowngrade ? "Downgrade" : "Select Plan"}
          </Button>
        )}
      </div>
    </div>
  );
}
