import client from "../../../core/api/client";

import {
  saveTokens,
  clearTokens,
  getRefreshToken,
} from "../../../core/auth/tokenStorage";

import { getFriendlyError } from "../../../utils/error";

export const authService = {
  async register(data) {
    try {
      const res = await client.post("/auth/register", data);
      return res.data;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async registerVenueOwner(data) {
    try {
      // Check if payload has password field (means it's a new registration)
      if (data.password) {
        // Brand new venue owner — POST to /venue-owners/register
        const res = await client.post("/venue-owners/register", data);
        const { access_token, refresh_token } = res.data;
        saveTokens(access_token, refresh_token, true); // Auto-save token
        return res.data;
      } else {
        // Existing customer adding host profile — POST to /venue-owners/upgrade
        // Token already in headers via axios interceptor
        const res = await client.post("/venue-owners/upgrade", data);
        return res.data;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async login(data) {
    try {
      const { rememberMe = true, ...credentials } = data;
      const res = await client.post("/auth/login", credentials);
      const { access_token, refresh_token } = res.data;
      saveTokens(access_token,refresh_token, rememberMe);
      return res.data;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async googleLogin(idToken, rememberMe = true) {
    try {
      const res = await client.post("/auth/google", { id_token: idToken });
      const { access_token, refresh_token } = res.data;
      saveTokens(access_token, refresh_token, rememberMe);
      return res.data;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async getMe() {
    try {
      const res = await client.get("/auth/me");
      return res.data;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async logout() {
    try {
      const refresh_token = getRefreshToken();
      if (refresh_token) {
        await client.post("/auth/logout", {}, {
          headers: {
            Authorization: `Bearer ${refresh_token}`
          }
        });
      }
    } catch (_) {
    } finally {
      clearTokens();
    }
  },

};
