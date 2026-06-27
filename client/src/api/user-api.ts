import { apiClient } from "@/lib/axios-client";
import type { User, UserRole } from "@/types/auth.types";

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get("/user");
  return data.users;
};

export const updateUserRoleRequest = async ({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}): Promise<User> => {
  const { data } = await apiClient.patch(`/user/${userId}/role`, { role });
  return data.user;
};

export const deleteUserRequest = async (userId: string): Promise<void> => {
  await apiClient.delete(`/user/${userId}`);
};
