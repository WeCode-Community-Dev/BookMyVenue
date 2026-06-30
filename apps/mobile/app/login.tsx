import { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { z } from "zod";
import { authProvider } from "@/src/infrastructure/providers.native";
import { Button, H1, Input, Label, P } from "@/components/ui";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return Alert.alert("Invalid input", parsed.error.issues[0]?.message ?? "");
    setLoading(true);
    try {
      await authProvider.signInWithPassword(parsed.data);
      router.replace("/");
    } catch (err) {
      Alert.alert("Sign-in failed", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="p-6 gap-6">
        <H1>Welcome back</H1>
        <P>Sign in to manage your bookings and venues.</P>
        <View className="gap-3">
          <View>
            <Label>Email</Label>
            <Input
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View>
            <Label>Password</Label>
            <Input value={password} onChangeText={setPassword} secureTextEntry />
          </View>
          <Button onPress={submit} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <Button variant="ghost" onPress={() => router.push("/signup")}>
            Create an account
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
