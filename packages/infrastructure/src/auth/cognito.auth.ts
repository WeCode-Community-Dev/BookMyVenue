/**
 * SAMPLE adapter — AWS Cognito implementation of AuthProvider.
 *
 * This file is a typed skeleton: it compiles against the port but is NOT
 * wired into the composition root. To activate:
 *   1. `bun add @aws-sdk/client-cognito-identity-provider aws-jwt-verify`
 *   2. Provide USER_POOL_ID + CLIENT_ID via env
 *   3. Replace `makeSupabaseAuthProvider()` with `makeCognitoAuthProvider()`
 *      in src/infrastructure/services.ts
 *
 * OAuth flows on Cognito use the Hosted UI redirect — the client-side path
 * here only covers username/password + redirect-style OAuth.
 */

import type {
  AuthClaims,
  AuthProvider,
  AuthSession,
  OAuthProviderId,
  OAuthSignInOptions,
  OAuthSignInResult,
  Unsubscribe,
} from "@repo/contracts";

export interface CognitoAuthConfig {
  region: string;
  userPoolId: string;
  clientId: string;
  /** Hosted-UI domain, e.g. `myapp.auth.us-east-1.amazoncognito.com` */
  hostedUiDomain?: string;
}

export function makeCognitoAuthProvider(_cfg: CognitoAuthConfig): AuthProvider {
  // TODO: import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand }
  //       from "@aws-sdk/client-cognito-identity-provider";
  // TODO: import { CognitoJwtVerifier } from "aws-jwt-verify";

  const listeners = new Set<(s: AuthSession | null) => void>();

  return {
    async signInWithPassword(_input) {
      throw new Error("Cognito: signInWithPassword not implemented (sample)");
    },
    async signUp(_input) {
      throw new Error("Cognito: signUp not implemented (sample)");
    },
    async signInWithOAuth(
      _provider: OAuthProviderId,
      _opts?: OAuthSignInOptions,
    ): Promise<OAuthSignInResult> {
      // Redirect to: https://{hostedUiDomain}/oauth2/authorize?identity_provider=Google&...
      return { redirected: true };
    },
    async resetPasswordForEmail() {
      throw new Error("Cognito: resetPasswordForEmail not implemented (sample)");
    },
    async updatePassword() {
      throw new Error("Cognito: updatePassword not implemented (sample)");
    },
    async signOut() {
      listeners.forEach((cb) => cb(null));
    },
    async getSession() {
      return null;
    },
    onAuthStateChange(cb): Unsubscribe {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    async verifyAccessToken(_token: string): Promise<AuthClaims> {
      // const verifier = CognitoJwtVerifier.create({
      //   userPoolId: _cfg.userPoolId,
      //   tokenUse: "access",
      //   clientId: _cfg.clientId,
      // });
      // const payload = await verifier.verify(_token);
      // return payload as AuthClaims;
      throw new Error("Cognito: verifyAccessToken not implemented (sample)");
    },
  };
}
