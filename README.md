# BookMyVenue

A modern venue booking application built with TanStack Start, Cloudflare Workers, D1 Database, R2 Storage, and KV Cache.

## Local Development Setup

To run this application locally, you only need to use Cloudflare Wrangler.

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v10.0.0 or higher

### Step-by-Step Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Generate a random string for `BETTER_AUTH_SECRET` (e.g., using `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`) and update it in your `.env` file.

3. **Set Up the Local Database**
   Apply migrations to your local D1 database:

   ```bash
   npx wrangler d1 migrations apply book-my-venue-db --local
   ```

   Seed the local database with initial venue data:

   ```bash
   npm run db:seed
   ```

4. **Start the Development Server**
   Start the local development server using Wrangler:
   ```bash
   npx wrangler dev
   ```
   The app will be running at [http://127.0.0.1:8787](http://127.0.0.1:8787).

---

## Project Structure

- **`apps/`**: Sub-applications (e.g. mobile, MCP integrations).
- **`packages/`**: Monorepo packages for domain models, core contracts, and UI tokens.
- **`src/`**: The main TanStack Start web application.
  - `routes/`: Frontend routing structure.
  - `components/`: UI components.
  - `infrastructure/`: Providers and dependency injection.
  - `lib/`: Helper libraries, middleware, and core utilities.
