import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/src/hooks/use-auth";

export default function AuthLayout() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [session, loading, router]);

  return <Stack screenOptions={{ headerStyle: { backgroundColor: "#fafaf9" } }} />;
}
