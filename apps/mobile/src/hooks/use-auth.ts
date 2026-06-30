import { useEffect, useState } from "react";
import type { AuthSession, AuthUser } from "@repo/contracts";
import { authProvider } from "@/src/infrastructure/providers.native";

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
