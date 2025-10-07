"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

type Creator = {
  id: string;
  user_id: string;
  company_name: string;
  product_url: string | null;
  stripe_account_id: string | null;
  onboarding_completed: boolean;
  subscription_status: "trial" | "active" | "canceled" | "past_due";
  role: "platform_owner" | "saas_creator";
  created_at: string;
};

export default function ManageCreatorsPage() {
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchCreators();
  }, [filterStatus]);

  const fetchCreators = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to fetch creators
      // const response = await fetch(`/api/platform/creators?status=${filterStatus}`);
      // const data = await response.json();
      
      // Mock data
      const mockCreators: Creator[] = [
        {
          id: "1",
          user_id: "2",
          company_name: "Example SaaS Inc",
          product_url: "https://example.com",
          stripe_account_id: "acct_123",
          onboarding_completed: true,
          subscription_status: "active",
          role: "saas_creator",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          user_id: "3",
          company_name: "Another SaaS Co",
          product_url: "https://another-saas.com",
          stripe_account_id: null,
          onboarding_completed: false,
          subscription_status: "trial",
          role: "saas_creator",
          created_at: new Date().toISOString(),
        },
      ];
      
      setCreators(mockCreators);
    } catch (error) {
      console.error("Error fetching creators:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (creatorId: string, newStatus: string) => {
    try {
      // TODO: Call API to update creator status
      // await fetch(`/api/platform/creators/${creatorId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ subscription_status: newStatus }),
      // });
      
      alert(`Status updated successfully!`);
      fetchCreators();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      active: { variant: "default", label: "Active" },
      trial: { variant: "secondary", label: "Trial" },
      canceled: { variant: "destructive", label: "Canceled" },
      past_due: { variant: "outline", label: "Past Due" },
    };
    
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Manage SaaS Creators</h1>
          <p className="text-muted-foreground">
            View and manage all SaaS creators on the platform
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Creators</CardTitle>
              <CardDescription>
                {creators.length} creator{creators.length !== 1 ? "s" : ""} registered
              </CardDescription>
            </div>
            <select
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="canceled">Canceled</option>
              <option value="past_due">Past Due</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : creators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No creators found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Product URL</TableHead>
                  <TableHead>Onboarding</TableHead>
                  <TableHead>Stripe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creators.map((creator) => (
                  <TableRow key={creator.id}>
                    <TableCell className="font-medium">
                      {creator.company_name}
                    </TableCell>
                    <TableCell>
                      {creator.product_url ? (
                        <a
                          href={creator.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {creator.onboarding_completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      {creator.stripe_account_id ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(creator.subscription_status)}
                    </TableCell>
                    <TableCell>
                      {new Date(creator.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <select
                        className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={creator.subscription_status}
                        onChange={(e) => handleUpdateStatus(creator.id, e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="trial">Trial</option>
                        <option value="canceled">Canceled</option>
                        <option value="past_due">Past Due</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
