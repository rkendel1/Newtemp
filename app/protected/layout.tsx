import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top bar with profile and social buttons */}
          <TopBar />
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
