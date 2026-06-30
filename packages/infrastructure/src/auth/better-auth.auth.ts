// Better Auth implementation of AuthProvider.
// Maps Better Auth's client API to the provider-agnostic AuthProvider contract.

import type {
  AuthClaims,
  AuthProvider,
  AuthSession,
  OAuthProviderId,
  OAuthSignInOptions,
  OAuthSignInResult,
  Unsubscribe,
} from "@repo/contracts";

/**
 * Better Auth client instance — the object returned by `createAuthClient()`.
 * We keep it typed loosely so the infrastructure package doesn't import
 * better-auth directly (the app provides the concrete instance).
 */
export interface BetterAuthClient {
  signIn: {
    email: (opts: { email: string; password: string }) => Promise<{
      data?: { session: unknown; user: unknown } | null;
      error?: { message: string } | null;
    }>;
    social: (opts: { provider: string; callbackURL?: string }) => Promise<{
      data?: { url?: string; redirect?: boolean } | null;
      error?: { message: string } | null;
    }>;
  };
  signUp: {
    email: (opts: {
      email: string;
      password: string;
      name?: string;
      [key: string]: unknown;
    }) => Promise<{
      data?: { session: unknown; user: unknown } | null;
      error?: { message: string } | null;
    }>;
  };
  signOut: () => Promise<{ error?: { message: string } | null }>;
  getSession: () => Promise<{
    data?: {
      session: { token: string; expiresAt: string | Date };
      user: { id: string; email: string; name?: string; [k: string]: unknown };
    } | null;
    error?: { message: string } | null;
  }>;
  useSession: () => {
    data: {
      session: { token: string; expiresAt: string | Date } | null;
      user: { id: string; email: string; name?: string; [k: string]: unknown } | null;
    } | null;
    isPending: boolean;
    error: unknown;
  };
  forgetPassword: (opts: { email: string; redirectTo?: string }) => Promise<{
    error?: { message: string } | null;
  }>;
  resetPassword: (opts: { newPassword: string; token?: string }) => Promise<{
    error?: { message: string } | null;
  }>;
  // Subscribe to auth state changes
  $Infer?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSession(data: any): AuthSession | null {
  if (!data?.session || !data?.user) return null;
  return {
    accessToken: data.session.token ?? "",
    refreshToken: null,
    expiresAt: data.session.expiresAt ? new Date(data.session.expiresAt).getTime() / 1000 : null,
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      metadata: {
        first_name: data.user.firstName ?? data.user.name?.split(" ")[0] ?? null,
        last_name: data.user.lastName ?? data.user.name?.split(" ").slice(1).join(" ") ?? null,
        ...(data.user.role ? { role: data.user.role } : {}),
      },
    },
  };
}

export function makeBetterAuthProvider(client: BetterAuthClient): AuthProvider {
  // Keep track of auth state change listeners
  const listeners = new Set<(session: AuthSession | null) => void>();
  let currentSession: AuthSession | null = null;

  function notifyListeners(session: AuthSession | null) {
    currentSession = session;
    for (const cb of listeners) {
      try {
        cb(session);
      } catch {
        // ignore listener errors
      }
    }
  }

  return {
    async signInWithPassword({ email, password }) {
      const result = await client.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message);
      const session = toSession(result.data);
      if (!session) throw new Error("No session returned");
      notifyListeners(session);
      return session;
    },

    async signUp({ email, password, metadata }) {
      const result = await client.signUp.email({
        email,
        password,
        name: [metadata?.first_name, metadata?.last_name].filter(Boolean).join(" ") || undefined,
        firstName: metadata?.first_name as string | undefined,
        lastName: metadata?.last_name as string | undefined,
        role: metadata?.role as string | undefined,
      });
      if (result.error) throw new Error(result.error.message);
      const session = toSession(result.data);
      notifyListeners(session);
      return { session };
    },

    async signInWithOAuth(
      provider: OAuthProviderId,
      opts?: OAuthSignInOptions,
    ): Promise<OAuthSignInResult> {
      try {
        const result = await client.signIn.social({
          provider,
          callbackURL:
            opts?.redirectUri ??
            (typeof window !== "undefined" ? window.location.origin : undefined),
        });
        if (result.error) {
          return { redirected: false, error: new Error(result.error.message) };
        }
        // Better Auth social sign-in triggers a redirect
        return { redirected: true };
      } catch (err) {
        return {
          redirected: false,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    async signOut() {
      const result = await client.signOut();
      if (result.error) throw new Error(result.error.message);
      notifyListeners(null);
    },

    async getSession() {
      const result = await client.getSession();
      if (result.error || !result.data) return null;
      const session = toSession(result.data);
      currentSession = session;
      return session;
    },

    onAuthStateChange(cb): Unsubscribe {
      listeners.add(cb);
      // Immediately fire with current session
      if (currentSession !== undefined) {
        cb(currentSession);
      }
      return () => {
        listeners.delete(cb);
      };
    },

    async resetPasswordForEmail(email, opts) {
      const result = await client.forgetPassword({
        email,
        redirectTo: opts?.redirectUri,
      });
      if (result.error) throw new Error(result.error.message);
    },

    async updatePassword(newPassword) {
      const result = await client.resetPassword({ newPassword });
      if (result.error) throw new Error(result.error.message);
    },

    async verifyAccessToken(_token: string): Promise<AuthClaims> {
      // In Better Auth, session verification is done server-side via
      // auth.api.getSession({ headers }). This method is called from
      // the auth middleware which has the full request context.
      // For standalone token verification, we'd need the server auth instance.
      throw new Error(
        "verifyAccessToken is not used with Better Auth. " +
          "Use the auth middleware's getSession instead.",
      );
    },
  };
}
