import { createClient } from "@/utils/update/server";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

type Props = {
  searchParams: { message?: string } | Promise<{ message?: string }>;
};

export default async function ProtectedPage({ searchParams }: Props) {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  // Resolve searchParams if it's a Promise
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;

  if (!user) {
    return (
      <div>There was an error loading your account. Please try again.</div>
    );
  }

  return (
    <div className="space-y-8">
      {resolvedParams.message && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription>{resolvedParams.message}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your account and activity.
        </p>
      </div>



      {/* User Account Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Your Account</h2>
        
        <div className="border rounded-lg p-6 space-y-4 bg-card">
          <h3 className="font-medium">User Information</h3>
          <div className="grid gap-2 text-sm">
            <div className="grid grid-cols-[120px_1fr]">
              <div className="text-muted-foreground">Email</div>
              <div>{user?.email}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="text-muted-foreground">User ID</div>
              <div className="font-mono text-xs truncate">{user?.id}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="text-muted-foreground">Last Sign In</div>
              <div>
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "Never"}
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4 bg-card">
          <h3 className="font-medium">Authentication Status</h3>
          <div className="grid gap-2 text-sm">
            <div className="grid grid-cols-[120px_1fr]">
              <div className="text-muted-foreground">Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Authenticated
              </div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="text-muted-foreground">Providers</div>
              <div>
                {user.identities
                  ?.map((identity) => identity.provider)
                  .join(", ") || "Email"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
