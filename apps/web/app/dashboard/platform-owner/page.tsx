"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Package, DollarSign, TrendingUp } from "lucide-react";

export default function PlatformOwnerDashboard() {
  const [stats, setStats] = useState({
    total_creators: 0,
    active_creators: 0,
    trial_creators: 0,
    total_products: 0,
    total_subscribers: 0,
    monthly_revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch platform stats from API
    const fetchStats = async () => {
      try {
        // Mock data for now
        setStats({
          total_creators: 2,
          active_creators: 1,
          trial_creators: 1,
          total_products: 5,
          total_subscribers: 150,
          monthly_revenue: 45000,
        });
      } catch (error) {
        console.error("Error fetching platform stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Creators",
      value: stats.total_creators,
      description: `${stats.active_creators} active, ${stats.trial_creators} on trial`,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Products",
      value: stats.total_products,
      description: "Across all creators",
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "Total Subscribers",
      value: stats.total_subscribers,
      description: "Platform-wide",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats.monthly_revenue / 100).toFixed(2)}`,
      description: "From platform subscriptions",
      icon: DollarSign,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Owner Dashboard</h1>
        <p className="text-muted-foreground">
          Manage platform-wide settings and oversee all SaaS creators
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage platform settings and creators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="/dashboard/platform-owner/creators">
                Manage SaaS Creators
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard/platform-owner/settings">
                Platform Settings
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Owner Badge */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Platform Owner Access</CardTitle>
            <Badge variant="default">Owner</Badge>
          </div>
          <CardDescription>
            You have full access to all platform management features
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
