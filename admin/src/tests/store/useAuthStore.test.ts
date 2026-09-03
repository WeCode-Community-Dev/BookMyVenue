import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore, type UserProfile } from "@/store/useAuthStore";

describe("admin useAuthStore (Zustand)", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("should initialize with default state", () => {
    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
  });

  it("should set user profile and update isLoading to false", () => {
    const mockProfile: UserProfile = {
      _id: "admin_123",
      name: "Super Admin",
      username: "superadmin",
      email: "admin@bookmyvenue.com",
      role: "superAdmin",
      status: "active",
    };

    useAuthStore.getState().setProfile(mockProfile);

    const state = useAuthStore.getState();
    expect(state.profile).toEqual(mockProfile);
    expect(state.isLoading).toBe(false);
  });

  it("should update loading and error states correctly", () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);

    useAuthStore.getState().setError(true);
    expect(useAuthStore.getState().isError).toBe(true);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("should reset state on logout", () => {
    const mockProfile: UserProfile = {
      _id: "admin_123",
      name: "Admin User",
      username: "adminuser",
      email: "admin@example.com",
      role: "admin",
      status: "active",
    };

    useAuthStore.getState().setProfile(mockProfile);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(false);
  });
});
