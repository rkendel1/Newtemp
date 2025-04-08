"use client";

import { Button } from "@/components/ui/button";
import { ProductWithPrices, Subscription } from "@updatedev/js";
import { createClient } from "@/utils/update/client";
import { useState } from "react";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      router.refresh();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReactivateSubscription() {
    if (!currentSubscription) return;
    
    try {
      setActionLoading(true);
      const client = createClient();
      await client.billing.updateSubscription(currentSubscription.id, {
        cancel_at_period_end: false,
      });
      router.refresh();
    } catch (error) {
      console.error("Error reactivating subscription:", error);
    } finally {
      setActionLoading(false);
    }
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

  return (
    <div className={`border rounded-lg p-6 space-y-4 ${isCurrentPlan ? 'border-blue-500 dark:border-blue-400 shadow-md' : ''}`}>
      {isCurrentPlan && (
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 inline-block px-2 py-1 rounded-full mb-2">
          Current Plan
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-xl font-medium">{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{priceString}</span>
          {productPrice?.unit_amount && productPrice.interval && (
            <span className="text-muted-foreground">
              /{productPrice.interval}
              {productPrice.interval !== "one-time" && productPrice.interval_count !== 1 && 
                `(${productPrice.interval_count} ${productPrice.interval}s)`}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-3">
        {isCurrentPlan ? (
          <>
            {isPendingCancellation ? (
              <>
                <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                  <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                  <span>Your subscription will cancel at the end of the current billing period.</span>
                </div>
                <Button
                  className="w-full"
                  onClick={handleReactivateSubscription}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
                  Reactivate Subscription
                </Button>
              </>
            ) : (
              <Button
                className="w-full"
                onClick={handleCancelSubscription}
                variant="outline"
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
                Cancel Subscription
              </Button>
            )}
          </>
        ) : (
          <Button
            className="w-full"
            onClick={() => handleSelectPlan(productPrice.id)}
            disabled={isLoading}
            variant={isUpgrade ? "default" : isDowngrade ? "outline" : "default"}
          >
            {isLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
            {isUpgrade ? "Upgrade" : isDowngrade ? "Downgrade" : "Select Plan"}
          </Button>
        )}
        
        {isCurrentPlan && (
          <div className="flex items-center text-green-600 dark:text-green-400 justify-center text-sm">
            <Check size={16} className="mr-1" /> Active
          </div>
        )}
      </div>
    </div>
  );
}
