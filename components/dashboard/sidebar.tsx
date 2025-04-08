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

const navItems = [
  { name: "Dashboard", href: "/protected", icon: LayoutDashboard },
  { name: "Cat Photo Generator", href: "/protected/paid-content", icon: Cat },
  { name: "Subscriptions", href: "/protected/subscription", icon: CreditCard },
  { name: "Help", href: "/protected/help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

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
      
      {/* Upgrade button */}
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
      
      {/* App version */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">v1.0.0</p>
      </div>
    </aside>
  );
} 