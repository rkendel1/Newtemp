"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Check, BadgeCheck, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/styles";

interface FreePlanCardProps {
  isCurrentPlan: boolean;
  currentSubscription?: unknown; // TODO: Replace with your subscription type
}

export default function FreePlanCard({
  isCurrentPlan,
}: FreePlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with your upgrade logic
      console.log("Upgrade to paid plan");
      
      // Example: Redirect to pricing page
      // window.location.href = "/pricing";
    } catch (error) {
      console.error("Upgrade error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md",
        isCurrentPlan && "border-primary shadow-lg"
      )}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <BadgeCheck className="mr-1 h-3 w-3" />
            Current Plan
          </Badge>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Perfect for getting started with our platform
        </p>

        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground ml-1">/month</span>
          </div>
        </div>

        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          variant={isCurrentPlan ? "outline" : "default"}
          className="w-full mb-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Upgrade Plan
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Current Plan
            </>
          )}
        </Button>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span>Basic features included</span>
          </div>
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span>Community support</span>
          </div>
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </div>
  );
}