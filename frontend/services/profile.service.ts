import { api } from "@/lib/api";

export async function getMe() {
  const response = await api.get("/profile/me");
  return response.data;
}

export async function updateProfile(payload: any) {
  const response = await api.patch("/profile", payload);
  return response.data;
}

export async function uploadProfilePicture(formData: FormData) {
  const response = await api.post("/storage/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
