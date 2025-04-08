"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CreditCard, 
  HelpCircle,
  Zap,
  Cat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/update/client";
import { useRouter } from "next/navigation";

// Define subscription type
type Subscription = {
  id: string;
  status: string;
  cancel_at_period_end?: boolean;
  product: {
    name: string;
  };
};

const navItems = [
  { name: "Dashboard", href: "/protected", icon: LayoutDashboard },
  { name: "Cat Photo Generator", href: "/protected/paid-content", icon: Cat },
  { name: "Subscriptions", href: "/protected/subscription", icon: CreditCard },
  { name: "Pricing", href: "/protected/pricing", icon: Zap },
  { name: "Help", href: "/protected/help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const client = createClient();
        const { data: subscriptionData } = await client.billing.getSubscriptions();
        
        if (subscriptionData.subscriptions && subscriptionData.subscriptions.length > 0) {
          const currentSubscription = subscriptionData.subscriptions[0];
          setSubscription(currentSubscription);
          
          // Check if user has any active subscription
          const activeSubscription = currentSubscription.status === "active";
          setHasActiveSubscription(activeSubscription);
          
          // Check if subscription is being canceled
          setIsCancelled(!!currentSubscription.cancel_at_period_end);
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkSubscription();
  }, []);
  
  async function handleReactivateSubscription() {
    if (!subscription) return;
    
    try {
      setActionLoading(true);
      const client = createClient();
      await client.billing.updateSubscription(subscription.id, {
        cancel_at_period_end: false,
      });
      setIsCancelled(false);
      router.refresh();
    } catch (error) {
      console.error("Error reactivating subscription:", error);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-border">
        <Link href="/protected" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <span className="font-bold text-xl">SampleApp</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-primary" : ""} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Upgrade/Reactivate button - only show if user doesn't have an active subscription or if cancelled */}
      {!isLoading && (
        <>
          {(!hasActiveSubscription && !subscription) ? (
            <div className="px-4 pb-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-100 dark:border-blue-900">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">
                  Unlock Premium Features
                </p>
                <Link href="/protected/pricing" className="block">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white border-0 shadow-md flex items-center justify-center gap-2 h-10"
                  >
                    <Zap size={16} className="text-yellow-300" />
                    <span>Upgrade to Pro</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : isCancelled && subscription ? (
            <div className="px-4 pb-4">
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-3">
                  Your subscription will end soon
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-md flex items-center justify-center gap-2 h-10"
                  onClick={handleReactivateSubscription}
                  disabled={actionLoading}
                >
                  <Zap size={16} className="text-white" />
                  <span>{actionLoading ? "Processing..." : "Reactivate Subscription"}</span>
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
      
      {/* App version */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">v1.0.0</p>
      </div>
    </aside>
  );
} 