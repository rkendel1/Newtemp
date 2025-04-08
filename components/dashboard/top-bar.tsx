"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import { 
  User, 
  Menu, 
  Github, 
  MessageSquare,
  Bell
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

export function TopBar() {
  const [email, setEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch user email on the client side
  useEffect(() => {
    const getUser = async () => {
      const client = createClient();
      const { data } = await client.auth.getUser();
      setEmail(data.user?.email || null);
    };
    getUser();
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
      <div className="flex items-center gap-2">
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
            <DropdownMenuLabel>{email || "User"}</DropdownMenuLabel>
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