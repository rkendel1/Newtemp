import { createClient } from "@/utils/update/server";
import PricingContent from "@/components/pricing-content";
import { Card } from "@/components/ui/card";
import { InfoIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PricingPage() {
  const client = await createClient();
  const { data, error } = await client.billing.getProducts();
  const { data: subscriptionData } = await client.billing.getSubscriptions();

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium">Pricing Plans</h1>
          <p className="text-muted-foreground mt-2">
            Set up your pricing plans to enable premium features
          </p>
        </div>
        
        <Card className="p-6 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
          <div className="flex items-start gap-4">
            <InfoIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-2">
                Set up billing first
              </h3>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                There was an error loading your pricing plans because you need to complete the following steps in the Update dashboard:
              </p>
              
              <div className="space-y-4">
                <div className="pl-5 border-l-2 border-amber-200 dark:border-amber-700">
                  <h4 className="font-medium text-amber-800 dark:text-amber-400">1. Connect Stripe</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                    Go to your Update project settings and connect your Stripe account to handle payments securely.
                  </p>
                </div>
                
                <div className="pl-5 border-l-2 border-amber-200 dark:border-amber-700">
                  <h4 className="font-medium text-amber-800 dark:text-amber-400">2. Create an entitlement</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                    Add an entitlement like &quot;pro&quot; that will be used to control access to premium features in your app.
                  </p>
                </div>
                
                <div className="pl-5 border-l-2 border-amber-200 dark:border-amber-700">
                  <h4 className="font-medium text-amber-800 dark:text-amber-400">3. Create a product</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                    Create a product in your Update dashboard and connect it to the entitlement you created.
                  </p>
                </div>
                
                <div className="pl-5 border-l-2 border-amber-200 dark:border-amber-700">
                  <h4 className="font-medium text-amber-800 dark:text-amber-400">4. Add pricing</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                    Configure your pricing tiers for the product to define what users will pay.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button asChild>
                  <a href="https://update.dev/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Go to Update Dashboard
                    <ExternalLink size={16} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="text-sm text-muted-foreground">
          <p>
            Need more help? Check out the{" "}
            <a 
              href="https://update.dev/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              Update Documentation
            </a>
            {" "}for detailed setup instructions.
          </p>
        </div>
      </div>
    );
  }

  const currentProductId =
    subscriptionData.subscriptions == null ||
      subscriptionData.subscriptions.length === 0
      ? null
      : subscriptionData.subscriptions[0].product.id;

  return (
    <>
      <div>
        <h1 className="text-2xl font-medium">Pricing Plans</h1>
        <p className="text-muted-foreground mt-2">
          Choose the perfect plan for your needs
        </p>
      </div>

      <PricingContent
        products={data.products}
        currentProductId={currentProductId}
      />
    </>
  );
}
