import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/src/hooks/use-auth";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!session && inAuthGroup) router.replace("/login");
  }, [session, segments, loading, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#fafaf9" },
              headerTitleStyle: { fontFamily: "Instrument Serif" },
            }}
          >
            <Stack.Screen name="index" options={{ title: "Book My Venue" }} />
            <Stack.Screen name="login" options={{ title: "Sign in" }} />
            <Stack.Screen name="signup" options={{ title: "Create account" }} />
            <Stack.Screen name="venues/index" options={{ title: "Venues" }} />
            <Stack.Screen name="venues/[id]" options={{ title: "Venue" }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </AuthGate>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
