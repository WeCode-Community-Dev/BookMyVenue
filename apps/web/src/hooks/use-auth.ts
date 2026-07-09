import { useEffect, useState } from "react";
import type { AuthSession, AuthUser } from "@repo/contracts";
import { authProvider } from "@/infrastructure/providers";
import { useSession } from "@/lib/auth-client";

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = authProvider.onAuthStateChange((s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    authProvider.getSession().then((s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { session, user, loading };
}

export function useUserRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      return;
    }
    // In the Better Auth model, roles are stored as user metadata.
    // For a more complete solution, fetch roles from the server via a server function.
    const userRole = user.metadata?.role as string | undefined;
    if (userRole) {
      setRoles(userRole === "host" ? ["customer", "host"] : ["customer"]);
    } else {
      setRoles(["customer"]);
    }
    // TODO: For admin role detection, add a server function that checks
    // the user_roles table. For now, check user metadata.
    const isAdmin = user.metadata?.isAdmin === true;
    if (isAdmin && !roles.includes("admin")) {
      setRoles((prev) => [...prev, "admin"]);
    }
  }, [user]);

  return {
    user,
    roles,
    isHost: roles.includes("host"),
    isAdmin: roles.includes("admin"),
  };
}
