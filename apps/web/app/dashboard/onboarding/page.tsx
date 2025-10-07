"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, Link as LinkIcon, CreditCard, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type OnboardingStep = "company" | "product" | "stripe" | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("company");
  const [companyName, setCompanyName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Call API to create creator profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setCurrentStep("product");
    } catch (error) {
      console.error("Error creating creator profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Call API to create product
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setCurrentStep("stripe");
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeConnect = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Call API to get Stripe OAuth URL
      const response = await fetch("/api/stripe/connect");
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Error connecting to Stripe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipStripe = () => {
    setCurrentStep("complete");
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  const steps = [
    { id: "company", label: "Company Info", icon: Building2 },
    { id: "product", label: "Product Details", icon: LinkIcon },
    { id: "stripe", label: "Connect Stripe", icon: CreditCard },
    { id: "complete", label: "Complete", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background border-muted text-muted-foreground"
                      }`}
                    >
                      <StepIcon size={20} />
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 -mx-4 transition-colors ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          {currentStep === "company" && (
            <>
              <CardHeader>
                <CardTitle>Welcome to Your SaaS Platform</CardTitle>
                <CardDescription>
                  Let's get started by setting up your company profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="My SaaS Company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Continue"}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {currentStep === "product" && (
            <>
              <CardHeader>
                <CardTitle>Add Your Product</CardTitle>
                <CardDescription>
                  Tell us about your SaaS product or service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productUrl">Product URL</Label>
                    <Input
                      id="productUrl"
                      type="url"
                      placeholder="https://yourproduct.com"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      This is where your customers will access your service
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Continue"}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {currentStep === "stripe" && (
            <>
              <CardHeader>
                <CardTitle>Connect Your Stripe Account</CardTitle>
                <CardDescription>
                  Connect Stripe to start accepting payments from your customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!stripeConnected ? (
                  <>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="text-sm">
                        By connecting Stripe, you'll be able to:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Accept payments from your customers</li>
                        <li>Manage subscriptions automatically</li>
                        <li>Track revenue and metrics</li>
                        <li>Handle refunds and disputes</li>
                      </ul>
                    </div>
                    <Button
                      onClick={handleStripeConnect}
                      className="w-full"
                      disabled={isLoading}
                    >
                      <CreditCard size={18} className="mr-2" />
                      {isLoading ? "Connecting..." : "Connect with Stripe"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSkipStripe}
                      className="w-full"
                    >
                      Skip for now
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg flex items-center gap-3">
                      <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          Stripe Connected Successfully
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          You're all set to start accepting payments
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleComplete} className="w-full">
                      Continue to Dashboard
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </>
                )}
              </CardContent>
            </>
          )}

          {currentStep === "complete" && (
            <>
              <CardHeader>
                <CardTitle>You're All Set! 🎉</CardTitle>
                <CardDescription>
                  Your account has been successfully configured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="font-medium">Next Steps:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Create pricing tiers for your product</li>
                    <li>Customize your white-label subscriber portal</li>
                    <li>Set up usage metering and tracking</li>
                    <li>Invite your first customers</li>
                  </ul>
                </div>
                <Button onClick={handleComplete} className="w-full">
                  Go to Dashboard
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
