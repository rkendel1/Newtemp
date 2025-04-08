import { createClient } from "@/utils/update/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const client = await createClient();
  
  // Get the URL and code from the request
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  console.log("Auth callback called with URL:", requestUrl.toString());
  
  if (code) {
    try {
      // Exchange the code for a session
      console.log("Exchanging code for session");
      const result = await client.auth.exchangeCodeForSession(code);
      
      if (result.error) {
        // If there's an error, redirect to sign in with the error
        console.error("Error exchanging code:", result.error.message);
        return NextResponse.redirect(
          new URL(`/sign-in?error=${encodeURIComponent(result.error.message)}`, request.url)
        );
      }
      
      console.log("Session established for user:", result.data?.user?.email);
      
      // Check if this is likely an email confirmation
      // Supabase doesn't explicitly tell us the type, but we can infer it
      const isEmailConfirmation = requestUrl.searchParams.has("type") || 
                                 requestUrl.searchParams.has("next") ||
                                 requestUrl.searchParams.has("email") ||
                                 requestUrl.toString().includes("confirm");
                                 
      if (isEmailConfirmation && result.data?.user) {
        console.log("Identified as email confirmation flow");
        // Email confirmation success
        return NextResponse.redirect(
          new URL('/protected?message=Your+email+has+been+confirmed', request.url)
        );
      }
      
      console.log("Redirecting to protected page");
      return NextResponse.redirect(new URL("/protected", request.url));
    } catch (error) {
      console.error("Unexpected error in auth callback:", error);
      return NextResponse.redirect(
        new URL("/sign-in?error=An+unexpected+error+occurred", request.url)
      );
    }
  } else {
    console.warn("No code parameter found in callback URL");
    return NextResponse.redirect(new URL("/sign-in?error=Invalid+authentication+link", request.url));
  }
}
