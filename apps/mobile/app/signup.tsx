import { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { z } from "zod";
import { authProvider } from "@/src/infrastructure/providers.native";
import { Button, H1, Input, Label, P } from "@/components/ui";

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function submit() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) return Alert.alert("Invalid input", parsed.error.issues[0]?.message ?? "");
    setLoading(true);
    try {
      await authProvider.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        metadata: {
          first_name: parsed.data.first_name,
          last_name: parsed.data.last_name,
          role: "customer",
        },
      });
      Alert.alert("Check your email", "Confirm your account, then sign in.");
      router.replace("/login");
    } catch (err) {
      Alert.alert("Signup failed", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="p-6 gap-6">
        <H1>Create your account</H1>
        <P>Book venues, host spaces, or both.</P>
        <View className="gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Label>First name</Label>
              <Input
                value={form.first_name}
                onChangeText={(v) => setForm({ ...form, first_name: v })}
              />
            </View>
            <View className="flex-1">
              <Label>Last name</Label>
              <Input
                value={form.last_name}
                onChangeText={(v) => setForm({ ...form, last_name: v })}
              />
            </View>
          </View>
          <View>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View>
            <Label>Password</Label>
            <Input
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              secureTextEntry
            />
          </View>
          <Button onPress={submit} disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
