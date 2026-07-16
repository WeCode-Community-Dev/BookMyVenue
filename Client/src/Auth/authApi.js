import AXIOS_API from "../Api/api";

export const authApi = {
  login: async (email, password) => {
    try {
      const res = await AXIOS_API.post("/api/v1/register/signIn", {
        email,
        password,
      });
      console.log("Success:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      console.error("Login Error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await AXIOS_API.get("/api/v1/register/logout");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed";
      console.error("Login Error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  refresh: async () => {
    try {
      const res = await AXIOS_API.get("/api/v1/register/refresh");
      console.log("...",res);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Refresh failed";
      console.error("Login Error:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
