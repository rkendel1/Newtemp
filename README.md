# Next.js Payment-Ready SaaS Template - Complete Monetization Boilerplate

🚀 Launch your SaaS faster with this production-ready Next.js 15 monetization template. Built for developers who need a complete payment system, subscription management, and user authentication out of the box.

⚡️ Everything you need to start charging customers: Stripe integration, Supabase auth, Update.dev billing and auth wrapper, premium content gating, and beautiful Tailwind UI components. Perfect for indie hackers and startups building monetized applications.

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.3-181818?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-14.0.0-008CDD?style=for-the-badge&logo=stripe)](https://stripe.com)
[![Update](https://img.shields.io/badge/Update-1.0.0-181818?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6IiBmaWxsPSIjMDAwIi8+PC9zdmc+)](https://update.dev)

🚀⚡️📈 Production-ready Next.js 15 boilerplate for building monetizable SaaS applications. Built with developer experience in mind: Next.js 15 + TypeScript + Tailwind CSS + Supabase + Update.dev + Stripe + ESLint + Prettier + PostCSS ✨

A comprehensive starter kit for developers looking to build and monetize their SaaS applications quickly. This boilerplate includes everything you need to get started with payments, authentication, and premium content management.

## ✨ Key Features

### 🚀 Modern Tech Stack
- **Next.js 15** with App Router for blazing-fast performance
- **TypeScript** for type-safe development
- **Tailwind CSS 4** for beautiful, responsive design
- **Supabase** for authentication and database
- **Stripe** for subscription management
- **Update** for unified billing, authentication, and entitlement management

### 🔐 Authentication & Security
- Email/Password authentication
- Google OAuth integration
- Secure session management
- Protected routes and middleware
- Email confirmation flow
- Update-powered auth flow management

### 💳 Subscription Management
- Pre-configured subscription plans
- Stripe integration
- Customer portal
- Secure payment processing
- Update-powered entitlement management

### 🎨 UI/UX Features
- Responsive dashboard layout
- Mobile-first design
- Loading states and spinners
- Error boundaries
- Custom error messages

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn
- Supabase account
- Stripe account
- Update.dev account

### Installation

1. Create accounts on required services:
   - [Update.dev](https://update.dev)
   - [Supabase](https://supabase.com)
   - [Stripe](https://stripe.com)

2. Clone the repository:
```bash
git clone https://github.com/update-dev/boilerplate.git
cd boilerplate
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Set up environment variables:
```bash
cp .env.local.example .env.local
```

5. Configure Update.dev:
   - Go to [Update Dashboard](https://update.dev/dashboard)
   - Create an entitlement (e.g., "pro" for premium features)
   - Create a product that matches the entitlement (e.g., "Pro Plan" for $10/month)
   - Copy your Update public key

6. Update the environment variables in `.env.local` with your credentials:
```env
# Update Configuration
NEXT_PUBLIC_UPDATE_PUBLIC_KEY=your_update_public_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

7. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## 🔑 Entitlement Management

This boilerplate uses Update for entitlement management. Here's how it works:

1. **Creating Entitlements**:
   - Go to [Update Dashboard](https://update.dev/dashboard) > Entitlements
   - Create entitlements for your features (e.g., "premium", "team", "enterprise")
   - Each entitlement should match a product in your Stripe configuration

2. **Using Entitlements in Code**:
```typescript
// Example of checking entitlements
const client = await createClient();
const { data, error } = await client.entitlements.check("premium");

if (error) {
  // Handle error
  console.error("Error checking entitlement:", error);
  return;
}

if (data.hasAccess) {
  // User has access to premium features
  // Render premium content or enable features
} else {
  // User does not have access
  // Show upgrade prompt or disable features
}
```

3. **Checking Subscription Status**:
```typescript
// Example of checking subscription status
const { data: subscriptionData } = await client.billing.getSubscriptions();
const isPremiumUser = subscriptionData.subscriptions?.[0]?.status === "active";

if (isPremiumUser) {
  // User has an active subscription
  // Enable premium features
}
```

4. **Product-Entitlement Mapping**:
   - Ensure your Stripe products match the entitlements you create
   - For example:
     - "Pro Plan" ($10/month) → "premium" entitlement
     - "Team Plan" ($20/month) → "team" entitlement
     - "Enterprise Plan" ($50/month) → "enterprise" entitlement

## 📚 Documentation

For detailed documentation, visit:
- [Update Documentation](https://update.dev/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 🧩 Project Structure

```
.
├── app/                             # Next.js App Router
│   ├── (auth)/                      # Authentication routes
│   ├── protected/                   # Protected dashboard routes
│   ├── pricing/                     # Pricing page
│   └── page.tsx                     # Home page
├── components/                      # React components
│   ├── dashboard/                   # Dashboard components
│   ├── ui/                          # UI components
│   └── ...                          # Other components
└── utils/                           # Utility functions
```

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- [Discord Community](https://discord.gg/update-dev)
- [GitHub Issues](https://github.com/update-dev/boilerplate/issues)
- [Documentation](https://update.dev/docs)

## 🔗 Links

- [Website](https://update.dev)
- [GitHub](https://github.com/update-dev/boilerplate)
- [YouTube Tutorials](https://youtube.com/@update-dev)
- [Documentation](https://update.dev/docs)

---

Made with ❤️ by [Update.dev](https://update.dev)

Looking for custom features or support? Contact us at [support@update.dev](mailto:support@update.dev)
