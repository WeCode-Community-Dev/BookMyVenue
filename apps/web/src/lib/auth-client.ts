// Better Auth client-side instance.
// Used in React components for sign-in, sign-up, sign-out, and session management.

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  basePath: "/api/auth",
});

export const { signIn, signUp, signOut, useSession, getSession, resetPassword } = authClient;

export const forgetPassword = authClient.requestPasswordReset;
