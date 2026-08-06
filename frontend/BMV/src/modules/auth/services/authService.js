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
      if (data.password) {
        const res = await client.post("/venue-owners/register", data);
        const { access_token, refresh_token } = res.data;
        saveTokens(access_token, refresh_token, true);
        return res.data;
      } else {
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

  async updateProfile(data) {
    try {
      const res = await client.patch("/auth/me", data);
      return res.data;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // async refreshToken() {
  //   try {
  //     const refresh_token = getRefreshToken();
  //     const res = await client.post("/auth/refresh", { refresh_token });
  //     const { access_token } = res.data.data;
  //     saveTokens(access_token, refresh_token);
  //     return access_token;
  //   } catch (err) {
  //     clearTokens(); // refresh failed, force logout
  //     throw new Error(getFriendlyError(err.code));
  //   }
  // },
};
