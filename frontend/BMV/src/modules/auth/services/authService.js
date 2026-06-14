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
      return res.data.data;
    } catch (err) {
      throw new Error(getFriendlyError(err.code));
    }
  },

  async login(data) {
    try {
      const res = await client.post("/auth/login", data);
      const { access_token, refresh_token } = res.data.data;
      saveTokens(access_token, refresh_token);
      return res.data.data;
    } catch (err) {
      throw new Error(getFriendlyError(err.code));
    }
  },

  async logout() {
    try {
      const refresh_token = getRefreshToken();
      if (refresh_token) {
        await client.post("/auth/logout", { refresh_token });
      }
    } catch (_) {
    } finally {
      clearTokens();
    }
  },

  async refreshToken() {
    try {
      const refresh_token = getRefreshToken();
      const res = await client.post("/auth/refresh", { refresh_token });
      const { access_token } = res.data.data;
      saveTokens(access_token, refresh_token);
      return access_token;
    } catch (err) {
      clearTokens(); // refresh failed, force logout
      throw new Error(getFriendlyError(err.code));
    }
  },
};
