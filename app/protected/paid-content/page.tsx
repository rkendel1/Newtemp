"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/update/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, Loader2, AlertCircle, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Define subscription type
type Subscription = {
  status: string;
  product: {
    name: string;
  };
};

export default function PaidContentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [catImage, setCatImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserAndSubscription() {
      try {
        // Get client
        const client = createClient();
        
        // Get subscription
        const { data: subscriptionData } = await client.billing.getSubscriptions();
        setSubscription(subscriptionData.subscriptions?.[0] || null);
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserAndSubscription();
  }, []);
  
  const isPremiumUser = subscription && subscription.status === "active";
  
  async function generateCatImage() {
    if (!isPremiumUser) return;
    
    setIsGenerating(true);
    setCatImage(null);
    setError(null);
    
    try {
      // Get a random cat image
      const response = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await response.json();
      if (data && data.length > 0) {
        setCatImage(data[0].url);
      } else {
        setError("Couldn't fetch a cat image. Please try again.");
      }
    } catch (err) {
      console.error("Error generating cat image:", err);
      setError("Failed to generate a cat image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading your content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Premium Cat Generator</h1>
        <p className="text-muted-foreground">
          {isPremiumUser 
            ? "Enjoy unlimited adorable cat photos with your premium subscription!" 
            : "Upgrade to premium to access our exclusive Cat Photo Generator!"}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isPremiumUser ? (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-6 flex flex-col items-center text-center">
          <div className="bg-blue-100 dark:bg-blue-900/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Premium Feature</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            This feature is only available for premium subscribers. Upgrade your plan to access unlimited cat photos!
          </p>
          <Button asChild>
            <Link href="/protected/pricing">
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Card className="w-full max-w-lg overflow-hidden">
            <CardContent className="p-0 aspect-video relative flex items-center justify-center bg-muted">
              {catImage ? (
                <Image 
                  src={catImage}
                  alt="A cute cat"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <Cat className="h-12 w-12 text-muted-foreground/50" />
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button 
              onClick={generateCatImage}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Cat className="mr-2 h-4 w-4" />
                  Generate Cat Photo
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
