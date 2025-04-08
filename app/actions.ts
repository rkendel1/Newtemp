"use server";

import { createClient } from "@/utils/update/server";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/redirect";

// Simple email validation function
function isEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Basic password strength check
function isPasswordStrong(password: string): boolean {
  return password.length >= 8; // Minimum 8 characters
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const client = await createClient();

  console.log(`[SIGNIN] Attempting sign-in for email: ${email.substring(0, 3)}...`);

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  console.log(`[SIGNIN] Sign-in attempt result:`, { success: !error, errorMsg: error?.message });

  if (error) {
    console.error(`[SIGNIN] Sign-in error:`, error.message);
    
    // Check if the error is related to email confirmation
    if (error.message.includes('Email not confirmed')) {
      console.log(`[SIGNIN] Email not confirmed error`);
      // Redirect to email confirmation page with option to resend
      return redirect(`/email-confirmation?email=${encodeURIComponent(email)}&error=not_confirmed`);
    }
    
    // Check if the user doesn't exist
    if (error.message.toLowerCase().includes('email not found')) {
      console.log(`[SIGNIN] Email not found`);
      return encodedRedirect("error", "/sign-in", "No account found with this email. Please sign up first.");
    }
    
    // Check for invalid credentials
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      console.log(`[SIGNIN] Invalid credentials - email exists but password wrong`);
      // This means user exists but password is wrong
    }
    
    return encodedRedirect("error", "/sign-in", error.message);
  }

  console.log(`[SIGNIN] Sign-in successful, redirecting to protected page`);
  return redirect("/protected");
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const client = await createClient();

  console.log(`[SIGNUP] Starting sign-up process for email: ${email.substring(0, 3)}...`);

  // Validate email format
  if (!isEmail(email)) {
    console.error(`[SIGNUP] Invalid email format: ${email}`);
    return encodedRedirect("error", "/sign-in?mode=signup", "Please enter a valid email address.");
  }

  // Check password strength
  if (!isPasswordStrong(password)) {
    console.error(`[SIGNUP] Password too weak for email: ${email.substring(0, 3)}...`);
    return encodedRedirect("error", "/sign-in?mode=signup", "Password must be at least 8 characters long.");
  }

  // ======== METHOD 1: Try to get user by email with admin API ========
  try {
    console.log(`[SIGNUP] METHOD 1: Attempting admin.listUsers for ${email.substring(0, 3)}...`);
    // Note: This requires admin privileges and may not work with public-facing APIs
    // This method may not be available in all Supabase installs - will likely fail
    const { data, error: listError } = await client.auth.admin.listUsers();
    
    const users = data?.users?.filter(user => user.email === email);
    
    console.log(`[SIGNUP] METHOD 1 result:`, { 
      usersFound: users?.length > 0, 
      error: !!listError 
    });
    
    if (users && users.length > 0) {
      console.log(`[SIGNUP] METHOD 1: User exists for email: ${email.substring(0, 3)}...`);
      return encodedRedirect("error", "/sign-in?mode=signup", "An account with this email already exists. Please sign in instead.");
    }
  } catch (err) {
    console.error(`[SIGNUP] METHOD 1 error: Admin API likely not available`, err);
  }
  
  // ======== METHOD 2: Try passwordless sign-in to see if email exists ========
  try {
    console.log(`[SIGNUP] METHOD 2: Trying passwordless sign-in for ${email.substring(0, 3)}...`);
    const { error: magicLinkError } = await client.auth.signInWithOtp({
      email,
      options: {
        // Don't actually send the email
        shouldCreateUser: false,
      }
    });
    
    console.log(`[SIGNUP] METHOD 2 result:`, { error: magicLinkError?.message });
    
    if (magicLinkError) {
      if (magicLinkError.message.toLowerCase().includes('email not found')) {
        console.log(`[SIGNUP] METHOD 2: Email not found, user does not exist`);
        // Email doesn't exist, continue with sign-up
      } else {
        console.log(`[SIGNUP] METHOD 2: User might exist, error: ${magicLinkError.message}`);
        // Any other error might indicate the user exists
        if (!magicLinkError.message.toLowerCase().includes('rate limit') && 
            !magicLinkError.message.toLowerCase().includes('network')) {
          return encodedRedirect("error", "/sign-in?mode=signup", "An account with this email might already exist. Please sign in or reset your password.");
        }
      }
    } else {
      console.log(`[SIGNUP] METHOD 2: No error, OTP request succeeded, user likely exists`);
      return encodedRedirect("error", "/sign-in?mode=signup", "An account with this email already exists. Please sign in instead.");
    }
  } catch (err) {
    console.error(`[SIGNUP] METHOD 2 error:`, err);
  }

  // ======== METHOD 3: Try login with fake password ========
  try {
    console.log(`[SIGNUP] METHOD 3: Trying login with fake password for ${email.substring(0, 3)}...`);
    const { error: signInError } = await client.auth.signInWithPassword({
      email,
      password: "checkonly" + Math.random(),
    });
    
    console.log(`[SIGNUP] METHOD 3 result:`, { error: signInError?.message });
    
    if (signInError) {
      if (signInError.message.toLowerCase().includes('invalid login credentials')) {
        console.log(`[SIGNUP] METHOD 3: Invalid credentials, user likely exists`);
        return encodedRedirect("error", "/sign-in?mode=signup", "An account with this email already exists. Please sign in instead.");
      } else if (signInError.message.toLowerCase().includes('email not confirmed')) {
        console.log(`[SIGNUP] METHOD 3: Email not confirmed, user exists`);
        return encodedRedirect("error", "/sign-in?mode=signup", "An account with this email exists but hasn't been confirmed. Please check your email or request a new confirmation email.");
      }
    }
  } catch (err) {
    console.error(`[SIGNUP] METHOD 3 error:`, err);
  }

  // ======== METHOD 4: Try the actual sign-up ========
  console.log(`[SIGNUP] METHOD 4: Proceeding with actual sign-up for ${email.substring(0, 3)}...`);
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    }
  });

  console.log(`[SIGNUP] METHOD 4 result:`, { 
    success: !error, 
    error: error?.message, 
    status: error?.status,
    user: data?.user ? 'exists' : 'null',
    confirmed: data?.user?.email_confirmed_at ? 'yes' : 'no',
    identities: data?.user?.identities?.length || 0
  });

  // Process errors from the actual sign-up attempt
  if (error) {
    console.error(`[SIGNUP] Sign-up error:`, error.message, error.status);
    
    // Check for all possible duplicate email error messages
    const errorMsg = error.message.toLowerCase();
    const isDuplicateEmailError = 
      errorMsg.includes('email already') || 
      errorMsg.includes('already registered') || 
      errorMsg.includes('duplicate') ||
      errorMsg.includes('already exists') ||
      errorMsg.includes('already in use') ||
      errorMsg.includes('already taken') ||
      errorMsg.includes('user already') ||
      errorMsg.includes('already signed up') ||
      errorMsg.includes('already been registered') ||
      (error.status === 400 && errorMsg.includes('email'));
    
    if (isDuplicateEmailError) {
      console.log(`[SIGNUP] Duplicate email detected from API error`);
      return encodedRedirect("error", "/sign-in", "An account with this email already exists. Please sign in instead.");
    }
    
    return encodedRedirect("error", "/sign-in?mode=signup", error.message);
  }

  // ======== Process successful sign-up ========
  console.log(`[SIGNUP] Sign-up apparently successful, checking details:`, {
    userIdentities: data?.user?.identities?.length,
    emailConfirmed: data?.user?.email_confirmed_at,
    userId: data?.user?.id
  });

  // CRITICAL CHECK: If Supabase returns a user with no identities AND no confirmed email,
  // this is likely an existing unconfirmed user, not a new registration
  if (data?.user && data.user.identities?.length === 0 && !data.user.email_confirmed_at) {
    console.log(`[SIGNUP] DETECTED EXISTING UNCONFIRMED USER - this is a duplicate email case`);
    
    // Check if we got a user ID - if so, this is definitely an existing user
    if (data.user.id) {
      console.log(`[SIGNUP] User ID exists (${data.user.id.substring(0, 8)}...), this is definitely a duplicate email`);
      // Redirect to sign-in page directly instead of email confirmation
      return encodedRedirect("error", "/sign-in", "An account with this email already exists. Please sign in with your password.");
    }
  }

  // If user email is not confirmed, redirect to confirmation page
  if (!data?.user?.email_confirmed_at) {
    console.log(`[SIGNUP] Email confirmation required, redirecting to email confirmation page`);
    return redirect(`/email-confirmation?email=${encodeURIComponent(email)}&status=pending`);
  }

  // User was already confirmed (rare case)
  console.log(`[SIGNUP] User already confirmed, redirecting to protected page`);
  return redirect("/protected");
};

export const googleSignInAction = async () => {
  const client = await createClient();
  
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

export const signOutAction = async () => {
  const client = await createClient();
  await client.auth.signOut();
  return redirect("/sign-in");
};

export const resendConfirmationEmail = async (email: string) => {
  const client = await createClient();
  
  console.log(`[RESEND] Attempting to resend confirmation for email: ${email.substring(0, 3)}...`);
  
  // First check if email exists with a sign-in attempt
  try {
    console.log(`[RESEND] Checking if email exists with sign-in attempt`);
    const { error: signInError } = await client.auth.signInWithPassword({
      email,
      password: "checkonly" + Math.random(),  // Use wrong password to check existence
    });
    
    console.log(`[RESEND] Sign-in check result:`, { error: signInError?.message });
    
    if (signInError) {
      if (signInError.message.toLowerCase().includes('invalid login credentials')) {
        console.log(`[RESEND] Email exists based on credentials error`);
        // Email exists, continue with resend
      } else if (!signInError.message.toLowerCase().includes('email not found')) {
        console.log(`[RESEND] Unexpected error checking email:`, signInError.message);
      }
    }
  } catch (err) {
    console.error(`[RESEND] Error during email existence check:`, err);
  }
  
  // Try to resend the confirmation email
  console.log(`[RESEND] Calling auth.resend for ${email.substring(0, 3)}...`);
  const { error } = await client.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  console.log(`[RESEND] Auth.resend result:`, { error: error?.message });

  if (error) {
    // Check if the error indicates the email doesn't exist or is already confirmed
    if (error.message.includes('Email already confirmed')) {
      console.log(`[RESEND] Email already confirmed`);
      return encodedRedirect("success", "/sign-in", "Your email is already confirmed. You can sign in now.");
    }
    if (error.message.includes('Email not found')) {
      console.log(`[RESEND] Email not found in database`);
      return redirect(`/email-confirmation?email=${encodeURIComponent(email)}&error=not_found`);
    }
    
    // Check for any other errors that might indicate the account exists but has issues
    const errorMsg = error.message.toLowerCase();
    if (errorMsg.includes('already exists') || 
        errorMsg.includes('already in use') || 
        errorMsg.includes('already taken') ||
        errorMsg.includes('user already')) {
      console.log(`[RESEND] Detected existing account from API error`);
      return encodedRedirect("success", "/sign-in", "An account with this email already exists. Please sign in with your password.");
    }
    
    console.log(`[RESEND] Error resending confirmation:`, error.message);
    return redirect(`/email-confirmation?email=${encodeURIComponent(email)}&error=send_failed`);
  }

  console.log(`[RESEND] Confirmation email successfully resent`);
  return redirect(`/email-confirmation?email=${encodeURIComponent(email)}&status=resent`);
};
