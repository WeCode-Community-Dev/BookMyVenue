import { useApiQuery } from "@/hooks/useApi";
import { AuthContext, type UserProfile } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    data: profile,
    isLoading,
    isError,
  } = useApiQuery<UserProfile>(
    ["profile"],
    { method: "GET", url: "/api/v1/user/profile" },
    { staleTime: 1000 * 60 * 5 },
  );

  return (
    <AuthContext.Provider
      value={{ profile: profile ?? null, isLoading, isError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
