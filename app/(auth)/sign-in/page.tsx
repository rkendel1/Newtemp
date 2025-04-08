import { signInAction, signUpAction } from "@/app/actions";
import AuthSubmitButton from "@/components/auth-submit-button";
import GoogleSignInButton from "@/components/google-sign-in-button";
import { FormMessage, Message } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function SignIn(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  // For debugging - log the search params to see what's coming in
  console.log("SearchParams in sign-in page:", searchParams);
  
  // Fix to properly handle the mode parameter, ensuring it doesn't include any additional query strings
  let isSignUp = false;
  if (searchParams && "mode" in searchParams) {
    // Extract just the "signup" part if the mode parameter contains additional text
    const modeValue = String(searchParams.mode);
    isSignUp = modeValue === "signup" || modeValue.startsWith("signup?") || modeValue.startsWith("signup&");
  }
  
  const action = isSignUp ? signUpAction : signInAction;
  const formTitle = isSignUp ? "Sign up" : "Sign in";
  const toggleText = isSignUp ? "Already have an account?" : "Don't have an account?";
  const toggleLink = isSignUp ? "/sign-in" : "/sign-in?mode=signup";
  const toggleAction = isSignUp ? "Sign in" : "Sign up";
  const buttonText = isSignUp ? "Sign up" : "Sign in";

  // Check for email already exists error with more flexible matching
  const hasExistingEmailError = searchParams && 
    "error" in searchParams && 
    typeof searchParams.error === 'string' && (
      searchParams.error.toLowerCase().includes("already exist") || 
      searchParams.error.toLowerCase().includes("email already") ||
      searchParams.error.toLowerCase().includes("already registered")
    );

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto mt-16 px-8 sm:px-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{formTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {toggleText}{" "}
          <Link className="text-primary font-medium hover:underline" href={toggleLink}>
            {toggleAction}
          </Link>
        </p>
        
        {isSignUp && (
          <p className="text-xs text-muted-foreground mt-2">
            You&apos;ll receive an email confirmation after sign up.
          </p>
        )}
        
        {hasExistingEmailError && (
          <div className="mt-4 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
            <p className="text-sm">
              An account with this email already exists. Please sign in instead.
              <Link href="/sign-in" className="ml-1 font-medium underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-6">
        {/* Google Sign-in Button */}
        <div className="w-full">
          <GoogleSignInButton />
        </div>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
          </div>
        </div>
        
        {/* Email Form */}
        <form className="space-y-4" action={action}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email" 
              type="email"
              placeholder="you@example.com" 
              className="h-11"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              {!isSignUp && (
                <Link 
                  href="#" 
                  className="text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              className="h-11"
              required
            />
          </div>
          
          <AuthSubmitButton text={buttonText} />
          
          <FormMessage message={searchParams} />
        </form>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          By continuing, you agree to our{" "}
          <Link href="#" className="hover:underline text-foreground">Terms of Service</Link>{" "}
          and{" "}
          <Link href="#" className="hover:underline text-foreground">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
