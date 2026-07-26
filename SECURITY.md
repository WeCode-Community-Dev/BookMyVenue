# Security Policy

## Supported Versions

Currently in Phase 1 MVP development — only the latest commit on `main`/`dev` is supported.

## Reporting a Vulnerability

To report a security vulnerability, please email **me@ashishshaiju.com** (do **NOT** open a public GitHub issue).

You should receive an acknowledgment within 48 hours. If you don't, follow up to ensure we received your report.

We ask that you:

- Provide a detailed description of the vulnerability
- Include steps to reproduce if possible
- Allow us reasonable time to address the issue before any public disclosure

### What We Do

- Acknowledge receipt within 2 business days
- Investigate and provide a timeline for fix
- Release a patch and credit the reporter (if desired)
- Backport fixes to supported versions as needed

## Scope

- **Server** (`server/`): Express API, authentication (JWT), payment processing (Razorpay), data handling
- **Client** (`client/`): User-facing React app, API communication
- **Admin** (`admin/`): Admin dashboard, user/venue management

## Security Measures

- **Authentication**: JWT-based access + refresh token flow with HTTP-only cookies
- **Rate Limiting**: Global (100 req/15min), login (10 req/15min), sensitive endpoints (5 req/15min)
- **Headers**: Helmet.js for security headers
- **Payment Webhooks**: Razorpay HMAC-SHA256 signature verification on raw request body
- **Input Validation**: Zod schemas on all endpoints with centralized validation middleware
- **Dependencies**: Regular updates via pnpm, Dependabot configured
- **Secrets**: All secrets and API keys managed via environment variables, never hardcoded

## Data Handling

- Passwords hashed with bcrypt
- MongoDB connection uses SRV + TLS in production
- Email service via Resend (API key authenticated)
- File uploads processed through Cloudinary (not stored on application servers)

## Disclosure Policy

We follow coordinated disclosure:

1. Reporter submits vulnerability privately
2. We investigate and fix
3. We release a security advisory with the fix
4. Reporter may disclose publicly after advisory release
