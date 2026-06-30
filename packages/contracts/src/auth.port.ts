// Provider-agnostic authentication port.
// Implementations live in @repo/infrastructure/auth/*.

export interface AuthUser {
  id: string;
  email?: string | null;
  metadata?: Record<string, unknown>;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: number | null;
  user: AuthUser;
}

export interface AuthClaims {
  sub: string;
  email?: string;
  [k: string]: unknown;
}

export type OAuthProviderId = "google" | "apple" | "microsoft" | "github";

export interface OAuthSignInOptions {
  redirectUri?: string;
  extraParams?: Record<string, string>;
}

export interface OAuthSignInResult {
  /** True when the browser is being redirected to the provider. */
  redirected: boolean;
  /** Set when sign-in completed inline (e.g. popup/broker flow). */
  session?: AuthSession;
  error?: Error;
}

export type Unsubscribe = () => void;

/**
 * Cross-cutting authentication contract. Swap the implementation in the
 * composition root to migrate to Cognito, Cloudflare Access, Auth0, etc.
 */
export interface AuthProvider {
  // ----- Client-side -----
  signInWithPassword(input: { email: string; password: string }): Promise<AuthSession>;

  signUp(input: {
    email: string;
    password: string;
    metadata?: Record<string, unknown>;
    emailRedirectTo?: string;
  }): Promise<{ session: AuthSession | null }>;

  signInWithOAuth(provider: OAuthProviderId, opts?: OAuthSignInOptions): Promise<OAuthSignInResult>;

  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  onAuthStateChange(cb: (session: AuthSession | null) => void): Unsubscribe;

  /** Send a password-reset email. */
  resetPasswordForEmail(email: string, opts?: { redirectUri?: string }): Promise<void>;

  /** Update the current user's password (requires an active session). */
  updatePassword(newPassword: string): Promise<void>;

  // ----- Server-side -----
  /** Verify an access token and return its claims. Throws on invalid. */
  verifyAccessToken(token: string): Promise<AuthClaims>;
}
