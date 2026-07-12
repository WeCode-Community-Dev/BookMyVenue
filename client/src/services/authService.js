import apiClient from "./apiClient";

const extractUser = (responseData) => {
  return responseData?.data?.user || responseData?.data || responseData?.user || null;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);

  return {
    ...response.data,
    user: extractUser(response.data),
  };
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);

  return {
    ...response.data,
    user: extractUser(response.data),
  };
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");

  return {
    ...response.data,
    user: extractUser(response.data),
  };
};

export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

