"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function PlatformSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    platform_subscription_price: 2900,
    platform_subscription_currency: "USD",
    platform_billing_interval: "month" as "month" | "year",
    platform_trial_days: 14,
  });

  useEffect(() => {
    // TODO: Fetch current platform settings from API
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Mock API call
        // const response = await fetch('/api/platform/settings');
        // const data = await response.json();
        // setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // TODO: Call API to update platform settings
      // const response = await fetch('/api/platform/settings', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      alert("Platform settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure platform-wide subscription pricing and settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Settings</CardTitle>
            <CardDescription>
              Set the subscription price that SaaS creators will pay to use this platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Subscription Price (in cents)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={settings.platform_subscription_price}
                  onChange={(e) => setSettings({
                    ...settings,
                    platform_subscription_price: Number(e.target.value)
                  })}
                  placeholder="2900"
                />
                <p className="text-xs text-muted-foreground">
                  Current: ${(settings.platform_subscription_price / 100).toFixed(2)} {settings.platform_subscription_currency}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={settings.platform_subscription_currency}
                  onChange={(e) => setSettings({
                    ...settings,
                    platform_subscription_currency: e.target.value
                  })}
                  placeholder="USD"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Billing Interval</Label>
                <select
                  id="interval"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={settings.platform_billing_interval}
                  onChange={(e) => setSettings({
                    ...settings,
                    platform_billing_interval: e.target.value as "month" | "year"
                  })}
                >
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trial">Trial Period (days)</Label>
                <Input
                  id="trial"
                  type="number"
                  min="0"
                  value={settings.platform_trial_days}
                  onChange={(e) => setSettings({
                    ...settings,
                    platform_trial_days: Number(e.target.value)
                  })}
                  placeholder="14"
                />
                <p className="text-xs text-muted-foreground">
                  Number of free trial days for new creators
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
