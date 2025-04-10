# Update.dev Boilerplate

🚀 Modern SaaS Boilerplate with Next.js 15+, Supabase, and Stripe Integration ⚡️

A complete starter kit for building production-ready SaaS applications with authentication, dashboard layout, and payment infrastructure ready to go. Built with developer experience in mind: Next.js with App Router, TypeScript, Tailwind CSS, Supabase Auth, and more.

## ✨ Demo

Live demo: [Coming Soon](#)

## 🔑 Features

Developer experience first, with a production-ready codebase:

- ⚡ **Next.js 15** with App Router support [@https://nextjs.org/]
- 🔐 **Supabase Auth** with multiple auth methods [@https://supabase.com/auth]
  - Email/Password authentication with security best practices
  - Magic link (passwordless) authentication
  - OAuth providers (Google)
  - Comprehensive email confirmation flow
  - Proper error handling for all authentication scenarios
- 💰 **Stripe Integration** ready for subscription payments [@https://stripe.com/docs]
  - Pre-configured subscription plans
  - Secure payment processing
  - Webhook support for subscription events
  - Customer portal for subscription management
- 🎨 **Tailwind CSS 4** for styling with a beautiful UI [@https://tailwindcss.com/]
  - Consistent design system with custom variables
  - Dark mode support with system preference detection
  - Responsive layouts for all screen sizes
- 🔤 **TypeScript** for type safety throughout the codebase [@https://www.typescriptlang.org/]
- 📏 **ESLint** for code quality [@https://eslint.org/]
  - Next.js Core Web Vitals configuration
  - TypeScript support
  - React Hooks rules
- 🧩 **Shadcn UI** components library with accessibility features [@https://ui.shadcn.com/]
- 📱 **Responsive Design** with mobile-first approach
- 🌙 **Dark Mode** support with theme persistence
- 🔄 **Server Actions** for form handling and server-side operations
- 🧭 **Dashboard Layout** with sidebar and profile management
- 🔐 **Protected Routes** with authentication checks and redirects
- 📤 **Form Validation** with custom error handling
- 🌐 **SEO Ready** with configurable metadata
- 🚀 **Production Ready** deployment configuration

## 📋 Requirements

- Node.js 20+ and npm
- Supabase account (free tier works for development)
- Stripe account (for payment integration)
- Git for version control

## 🚀 Getting Started

Run the following command on your local environment:

```bash
git clone https://github.com/updatedotdev/boiler.git my-saas-app
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

# Update Configuration
NEXT_PUBLIC_UPDATE_PUBLIC_KEY=your_update_public_key

# Stripe Configuration (for payment processing)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

For production deployments, make sure to set the `NEXT_PUBLIC_SITE_URL` to your production URL.

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

## 🎨 Customization Guide

### Styling

1. **Theme Colors**: Update the color variables in `app/globals.css`
2. **Typography**: Modify font settings in `app/layout.tsx`
3. **Component Styling**: Customize shadcn UI components in `components/ui`

### Layout Customization

1. **Header**: Modify `components/header.tsx` for the main navigation
2. **Dashboard**: Update `components/dashboard/sidebar.tsx` and `top-bar.tsx`
3. **Home Page**: Edit `app/page.tsx` for the landing page design

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
- [Update.dev Documentation](https://update.dev/docs)

---

Made with ❤️ by [Update.dev](https://update.dev)

Looking for custom features or support? Contact us at [support@update.dev](mailto:support@update.dev)
