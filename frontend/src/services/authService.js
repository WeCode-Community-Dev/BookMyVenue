import api from "./axios";

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const becomeProvider = async () => {
  const { data } = await api.patch("/auth/become-provider");
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.patch("/auth/me", profileData);
  return data;
};

export const updateProfileImage = async (formData) => {
  const { data } = await api.patch("/auth/me/avatar", formData);
  return data;
};
