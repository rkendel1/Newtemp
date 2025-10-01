# SaaS Template Monorepo

A modern SaaS template built with Next.js, now restructured as a monorepo to match the pod architecture.

## Structure

This monorepo follows the same structure as the pod project:

```
saas-template/
├── apps/                    # Applications
│   ├── api/                # Backend API service
│   ├── web/                # Main SaaS application
│   └── www/                # Marketing/landing site
├── packages/               # Shared packages
│   ├── ui/                 # Shared UI components
│   ├── utils/              # Shared utility functions
│   ├── schema/             # Shared data schemas (Zod)
│   ├── emails/             # Email templates
│   ├── lint/               # Shared linting configs
│   ├── prettier/           # Shared formatting configs
│   └── tsconfig/           # Shared TypeScript configs
├── pnpm-workspace.yaml     # Workspace configuration
├── turbo.json             # Turbo build configuration
└── package.json           # Root package configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev          # Start all apps (API, web, www)
pnpm dev:api      # Start API server on port 3002
pnpm dev:web      # Start web app on port 3000
pnpm dev:www      # Start marketing site on port 3001

# Build all packages and apps
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

## Applications

### API (`apps/api`)
Backend API service with Express.js, providing authentication, user management, and subscription endpoints.

- **Port**: 3002
- **Features**: REST API, authentication, user management, subscriptions
- **Tech Stack**: Express.js, TypeScript, Zod validation
- **Deployment**: Docker + Fly.io

### Web App (`apps/web`)
The main SaaS application with authentication, protected routes, and subscription management.

- **Port**: 3000
- **Features**: Authentication, protected routes, subscription management
- **Deployment**: Docker + Fly.io

### Marketing Site (`apps/www`)
A simple marketing/landing site.

- **Port**: 3001
- **Features**: Landing pages, marketing content
- **Deployment**: Docker + Fly.io

## Shared Packages

### UI (`packages/ui`)
Shared React components and UI elements.

### Utils (`packages/utils`)
Shared utility functions and helpers.

### Schema (`packages/schema`)
Shared Zod schemas for data validation.

### Emails (`packages/emails`)
Email templates and utilities.

### Lint (`packages/lint`)
Shared ESLint configurations.

### Prettier (`packages/prettier`)
Shared Prettier configurations.

### TypeScript Config (`packages/tsconfig`)
Shared TypeScript configurations.

## Deployment

### API
```bash
pnpm deploy:api
```

### Web App
```bash
pnpm deploy:web
```

These commands will deploy the respective apps to Fly.io using their Docker configurations.

## Development

The monorepo uses:
- **pnpm** for package management
- **Turbo** for build orchestration
- **Docker** for containerization
- **Fly.io** for deployment

## Key Changes from Original

1. **Monorepo Structure**: Moved from single app to monorepo with apps/ and packages/
2. **Shared Packages**: Extracted common code into reusable packages
3. **Build System**: Added Turbo for efficient builds across packages
4. **Deployment**: Added Docker and Fly.io configuration
5. **TypeScript**: Centralized TypeScript configurations
6. **Linting**: Shared linting and formatting configurations

This structure now matches the pod project architecture, making it easier to scale and maintain as the project grows.