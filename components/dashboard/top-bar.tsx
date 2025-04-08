"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import { 
  User, 
  Menu, 
  Github, 
  MessageSquare,
  Bell,
  CreditCard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/update/client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  const [email, setEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [planName, setPlanName] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  // Fetch user email and subscription info on the client side
  useEffect(() => {
    const getUserData = async () => {
      const client = createClient();
      const { data } = await client.auth.getUser();
      setEmail(data.user?.email || null);
      
      // Get subscription data
      try {
        const { data: subscriptionData } = await client.billing.getSubscriptions();
        if (subscriptionData.subscriptions && subscriptionData.subscriptions.length > 0) {
          const subscription = subscriptionData.subscriptions[0];
          setPlanName(subscription.product.name);
          
          if (subscription.cancel_at_period_end) {
            setSubscriptionStatus("cancelling");
          } else if (subscription.status === "active") {
            setSubscriptionStatus("active");
          } else {
            setSubscriptionStatus(subscription.status);
          }
        }
      } catch (error) {
        console.error("Error loading subscription data:", error);
      }
    };
    
    getUserData();
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6">
      {/* Mobile menu button - visible on small screens */}
      <button 
        className="md:hidden mr-4 text-muted-foreground hover:text-foreground"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu size={20} />
      </button>
      
      {/* Title - visible on mobile */}
      <h1 className="text-lg font-semibold md:hidden">SampleApp</h1>
      
      {/* Search bar - grows to fill space */}
      <div className="flex-1"></div>
      
      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Plan indicator */}
        {planName && (
          <Badge 
            variant={subscriptionStatus === "active" ? "default" : 
                    subscriptionStatus === "cancelling" ? "secondary" : "outline"}
            className="px-2 py-0 flex items-center gap-1 hidden md:flex"
          >
            <CreditCard size={12} className="mr-1" />
            {planName}
            {subscriptionStatus === "cancelling" && " (Cancelling)"}
          </Badge>
        )}
      
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell size={18} />
        </Button>

        {/* Discord */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" asChild>
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">
            <MessageSquare size={18} />
          </a>
        </Button>
        
        {/* GitHub */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" asChild>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github size={18} />
          </a>
        </Button>
        
        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex flex-col">
              <span>{email || "User"}</span>
              {planName && (
                <span className="text-xs text-muted-foreground mt-1">
                  Plan: {planName}
                  {subscriptionStatus === "cancelling" && " (Cancelling)"}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/protected/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/protected/subscription">
                Subscriptions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/protected/help">Help</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signOutAction} className="w-full">
                <Button variant="ghost" className="w-full justify-start p-0 h-auto font-normal text-sm">
                  Sign out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 