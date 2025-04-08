# Payment Ready SaaS Boilerplate

🚀 Modern SaaS Boilerplate with Next.js, Supabase, and Stripe Integration ⚡️

A complete starter kit for building production-ready SaaS applications with authentication, dashboard layout, and payment infrastructure ready to go. Built with developer experience in mind: Next.js with App Router, TypeScript, Tailwind CSS, Supabase Auth, and more.

![SaaS Boilerplate Banner](https://github.com/yourusername/boiler/raw/main/public/boilerplate-banner.png)

## ✨ Demo

Live demo: [Coming Soon](#)

## 🔑 Features

Developer experience first, with a production-ready codebase:

- ⚡ **Next.js 14** with App Router support
- 🔐 **Supabase Auth** with multiple auth methods
  - Email/Password authentication with security best practices
  - Magic link (passwordless) authentication
  - OAuth providers (Google)
  - Comprehensive email confirmation flow
  - Proper error handling for all authentication scenarios
- 💰 **Stripe Integration** ready for subscription payments
  - Pre-configured subscription plans
  - Secure payment processing
  - Webhook support for subscription events
  - Customer portal for subscription management
- 🎨 **Tailwind CSS** for styling with a beautiful UI
  - Consistent design system with custom variables
  - Dark mode support with system preference detection
  - Responsive layouts for all screen sizes
- 🔤 **TypeScript** for type safety throughout the codebase
- 🧩 **Shadcn UI** components library with accessibility features
- 📱 **Responsive Design** with mobile-first approach
- 🌙 **Dark Mode** support with theme persistence
- 🔄 **Server Actions** for form handling and server-side operations
- 🧭 **Dashboard Layout** with sidebar and profile management
- 🔐 **Protected Routes** with authentication checks and redirects
- 📤 **Form Validation** with custom error handling
- 🌐 **SEO Ready** with configurable metadata
- 🚀 **Production Ready** deployment configuration

## 📋 Requirements

- Node.js 18+ and npm
- Supabase account (free tier works for development)
- Stripe account (for payment integration)
- Git for version control

## 🚀 Getting Started

Run the following command on your local environment:

```bash
git clone https://github.com/yourusername/boiler.git my-saas-app
cd my-saas-app
npm install
```

Copy the `.env.local.example` file to `.env.local` and update the environment variables:

```bash
cp .env.local.example .env.local
```

Then, you can run the project locally in development mode with live reload:

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see your project.

## 🔧 Environment Variables

To run this project, you need to set up the following environment variables in your `.env.local` file:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application URLs
NEXT_PUBLIC_SITE_URL=http://localhost:4000

# Update Configuration (if using Update)
NEXT_PUBLIC_UPDATE_PUBLIC_KEY=your_update_public_key

# Stripe Configuration (for payment processing)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

For production deployments, make sure to set the `NEXT_PUBLIC_SITE_URL` to your production URL.

## 🔒 Setting Up Supabase Authentication

### Creating a Supabase Project

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project and note down your project's URL and anon key
3. Set up your database schema (SQL migrations are included in this boilerplate)

### Configuring Authentication

1. In your Supabase dashboard, navigate to Authentication → Settings
2. Configure the Site URL to match your `NEXT_PUBLIC_SITE_URL`
3. Set up redirect URLs for OAuth providers
4. Configure email templates for authentication flows

### Setting Up Email Authentication

1. In the Supabase dashboard, go to Authentication → Email Templates
2. Customize the email templates to match your brand
3. Test the email flow in development environment

### Enabling Google Sign-In

To enable Google Sign-In:

1. Go to your Supabase dashboard
2. Navigate to Authentication → Providers
3. Enable Google provider
4. Create OAuth credentials in Google Cloud Console:
   - Go to https://console.cloud.google.com/
   - Create a new project (or use an existing one)
   - Navigate to APIs & Services → Credentials
   - Configure the OAuth consent screen
   - Create OAuth client ID credentials (Web application type)
   - Add authorized JavaScript origins and redirect URIs
5. Copy the Client ID and Client Secret to your Supabase configuration

### Additional Auth Providers

This boilerplate can be extended to support additional OAuth providers:

1. Enable the desired provider in Supabase Authentication settings
2. Update the sign-in UI to include the new provider
3. Add the necessary server actions for the authentication flow

## 📐 Architecture Overview

This boilerplate follows modern architectural patterns for a scalable SaaS application:

### Frontend Architecture

- **App Router**: Using Next.js 14 App Router for efficient routing and data fetching
- **Server Components**: Leveraging React Server Components for better performance
- **Client Components**: Using "use client" directive for interactive UI elements
- **Server Actions**: Implementing form submissions and data mutations securely

### Backend Architecture

- **Supabase**: Primary backend service for authentication and database
- **API Routes**: Next.js API routes for custom server-side logic
- **Webhooks**: Endpoints for handling external service events (e.g., Stripe)

### Authentication Flow

- **Sign Up**: Email/password registration with email verification
- **Sign In**: Multiple authentication methods with proper session management
- **Protected Routes**: Middleware for route protection and redirection
- **Session Management**: Secure handling of user sessions and tokens

### Database Structure

- **Users**: Managed by Supabase Auth
- **Subscriptions**: Linked to Stripe for payment tracking
- **Products/Services**: Your application-specific data models

## 🧩 Project Structure

```
.
├── app                             # Next.js App Router
│   ├── (auth)                      # Authentication routes
│   │   ├── auth                    # Auth callback handling
│   │   ├── email-confirmation      # Email confirmation page
│   │   ├── sign-in                 # Sign in/up page
│   │   └── sign-up                 # Redirect to sign-in with signup mode
│   ├── protected                   # Protected routes (dashboard)
│   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   ├── page.tsx                # Main dashboard page
│   │   ├── settings                # User settings
│   │   ├── billing                 # Subscription management
│   │   └── ...                     # Other dashboard routes
│   ├── api                         # API routes
│   │   └── webhook                 # Webhook handlers
│   ├── pricing                     # Pricing page
│   ├── actions.ts                  # Server actions
│   └── page.tsx                    # Home page
├── components                      # React components
│   ├── dashboard                   # Dashboard components
│   │   ├── sidebar.tsx             # Dashboard sidebar
│   │   └── top-bar.tsx             # Dashboard top navigation
│   ├── ui                          # UI components (shadcn)
│   ├── auth-submit-button.tsx      # Auth form submit button
│   ├── form-message.tsx            # Form error/success messages
│   ├── google-sign-in-button.tsx   # Google authentication button
│   ├── update-logo.tsx             # Logo component
│   └── header.tsx                  # Main site header
├── public                          # Static assets
├── utils                           # Utility functions
│   ├── redirect.ts                 # Redirect utilities
│   ├── stripe                      # Stripe utilities
│   └── update                      # Supabase client utilities
├── middleware.ts                   # Next.js middleware for auth checks
├── .env.local                      # Environment variables
└── next.config.js                  # Next.js configuration
```

## 🔄 Authentication Flow In Detail

This boilerplate includes a sophisticated authentication system with multiple flows:

### Email/Password Registration Flow

1. User submits the sign-up form with email and password
2. Server validates the input and checks for existing accounts
3. Supabase creates a new user and sends a confirmation email
4. User receives the email and clicks the confirmation link
5. Auth callback route processes the confirmation
6. User is redirected to the dashboard or sign-in page

### Sign-In Flow

1. User submits the sign-in form with credentials
2. Server authenticates with Supabase
3. On success, a session is created and the user is redirected to the dashboard
4. On failure, appropriate error messages are displayed

### OAuth (Google) Flow

1. User clicks the "Continue with Google" button
2. Supabase initiates the OAuth flow
3. User authenticates with Google
4. OAuth callback processes the authentication
5. User is redirected to the dashboard

### Password Reset Flow

1. User requests a password reset from the sign-in page
2. Supabase sends a password reset email
3. User clicks the reset link
4. User sets a new password
5. User is redirected to sign in with the new password

### Authentication Security

The authentication system implements several security best practices:

- Secure password hashing via Supabase
- JWT tokens for session management
- CSRF protection
- Rate limiting for auth attempts
- Automatic session refresh
- Secure cookie handling

## 💰 Stripe Integration

### Setting Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Update your environment variables with Stripe keys
4. Configure your subscription products and prices in the Stripe Dashboard

### Subscription Management

The boilerplate includes components for:

- Displaying subscription plans
- Processing subscription payments
- Managing subscription status
- Handling subscription cancellations and upgrades

### Webhook Integration

To handle Stripe events properly:

1. Install the Stripe CLI for local testing
2. Forward webhooks to your local environment during development
3. Configure webhook endpoints in your Stripe Dashboard for production
4. Implement webhook handlers in the `/api/webhook` route

## 🎨 Customization Guide

### Styling

1. **Theme Colors**: Update the color variables in `app/globals.css`
2. **Typography**: Modify font settings in `app/layout.tsx`
3. **Component Styling**: Customize shadcn UI components in `components/ui`

### Layout Customization

1. **Header**: Modify `components/header.tsx` for the main navigation
2. **Dashboard**: Update `components/dashboard/sidebar.tsx` and `top-bar.tsx`
3. **Home Page**: Edit `app/page.tsx` for the landing page design

### Adding New Features

1. **New Pages**: Create new files in the `app` directory
2. **API Routes**: Add new API endpoints in `app/api`
3. **Dashboard Sections**: Add new sections in `app/protected`

## 📱 Responsive Design

The boilerplate is fully responsive with:

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Mobile navigation menu
- Touch-friendly UI components

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

This project can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Self-hosted servers

For production deployment:

```bash
npm run build
npm run start
```

## 🧪 Security Best Practices

This boilerplate follows security best practices:

- All sensitive operations occur on the server via Server Actions
- Environment variables are properly handled
- Authentication state is securely managed
- Protected routes prevent unauthorized access
- Form inputs are validated on both client and server
- CSRF protection for forms
- HTTP-only cookies for session management
- Content Security Policy headers

## 🔍 SEO Optimization

- Metadata configuration in page layouts
- Semantic HTML structure
- Proper heading hierarchy
- OpenGraph tags for social sharing

## 📊 Analytics Integration

The boilerplate can be easily extended with:

- Google Analytics
- Plausible Analytics
- Custom event tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Resources and References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)

---

Made with ❤️ by [Your Name/Organization]

Looking for custom features or support? Contact us at [your-email@example.com]
