/**
 * SAMPLE adapter — Cloudflare Access implementation of AuthProvider.
 *
 * Cloudflare Access proxies your app and injects a `CF-Access-Jwt-Assertion`
 * header on every request. There is no client SDK for password sign-in;
 * users authenticate via Access' identity providers. The "client side" of
 * AuthProvider is therefore minimal — sessions come from the cookie that
 * Access manages.
 *
 * To activate:
 *   1. `bun add jose`
 *   2. Set CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD env vars
 *   3. Swap the provider in the composition root
 */

import type {
  AuthClaims,
  AuthProvider,
  AuthSession,
  OAuthSignInResult,
  Unsubscribe,
} from "@repo/contracts";

export interface CloudflareAccessConfig {
  /** e.g. `your-team.cloudflareaccess.com` */
  teamDomain: string;
  /** Application AUD tag from the CF Access dashboard. */
  audience: string;
}

export function makeCloudflareAccessAuthProvider(_cfg: CloudflareAccessConfig): AuthProvider {
  // TODO: import { createRemoteJWKSet, jwtVerify } from "jose";
  // const jwks = createRemoteJWKSet(
  //   new URL(`https://${_cfg.teamDomain}/cdn-cgi/access/certs`),
  // );

  return {
    async signInWithPassword() {
      throw new Error(
        "Cloudflare Access manages sign-in via its IdP — redirect to /cdn-cgi/access/login",
      );
    },
    async signUp() {
      throw new Error("Cloudflare Access does not support self-service signup");
    },
    async signInWithOAuth(): Promise<OAuthSignInResult> {
      // window.location.href = `/cdn-cgi/access/login/${appAud}`;
      return { redirected: true };
    },
    async resetPasswordForEmail() {
      throw new Error("Cloudflare Access: resetPasswordForEmail not implemented (sample)");
    },
    async updatePassword() {
      throw new Error("Cloudflare Access: updatePassword not implemented (sample)");
    },
    async signOut() {
      // window.location.href = `https://${_cfg.teamDomain}/cdn-cgi/access/logout`;
    },
    async getSession(): Promise<AuthSession | null> {
      // Cookie-driven — no client API.
      return null;
    },
    onAuthStateChange(): Unsubscribe {
      return () => undefined;
    },
    async verifyAccessToken(_token: string): Promise<AuthClaims> {
      // const { payload } = await jwtVerify(_token, jwks, {
      //   issuer: `https://${_cfg.teamDomain}`,
      //   audience: _cfg.audience,
      // });
      // return payload as AuthClaims;
      throw new Error("Cloudflare Access: verifyAccessToken not implemented (sample)");
    },
  };
}
