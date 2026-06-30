// Better Auth server-side configuration.
// This is the central auth instance — it handles sign-up, sign-in, sessions,
// OAuth, password reset, and email verification.
//
// In a Cloudflare Worker / TanStack Start app, the `auth` instance is created
// per-request with the D1 binding from the Worker environment.

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { profiles, sessions, accounts, verifications } from "@repo/infrastructure";
import { getCloudflareEnv } from "./cloudflare-env";

/**
 * Create a Better Auth instance bound to the current request's D1 database.
 * Reads bindings directly from the Cloudflare Workers environment.
 */
export function createAuth() {
  const cfEnv = getCloudflareEnv();
  const db = drizzle(cfEnv.DB);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: profiles,
        session: sessions,
        account: accounts,
        verification: verifications,
      },
    }),
    secret: cfEnv.BETTER_AUTH_SECRET,
    baseURL: cfEnv.BETTER_AUTH_URL,
    basePath: "/api/auth",

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      // Send verification emails when users sign up
      sendResetPassword: async ({ user, url }) => {
        // TODO: Integrate with Resend email sender
        console.log(`[auth] Password reset for ${user.email}: ${url}`);
      },
    },

    socialProviders: {
      ...(cfEnv.GOOGLE_CLIENT_ID && cfEnv.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: cfEnv.GOOGLE_CLIENT_ID,
              clientSecret: cfEnv.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
    },

    user: {
      // Store additional fields on the user
      additionalFields: {
        firstName: { type: "string", required: false },
        lastName: { type: "string", required: false },
        role: { type: "string", required: false },
      },
    },

    session: {
      // Sessions last 30 days, refreshed on each request
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24, // refresh once per day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },

    advanced: {
      // Cross-origin cookie settings for development
      crossSubDomainCookies: {
        enabled: false,
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
