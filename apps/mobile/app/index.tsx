import { ScrollView, View, Image } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H1, P } from "@/components/ui";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="p-6 gap-8">
        <View className="gap-3 mt-8">
          <H1>Find a venue worth remembering.</H1>
          <P className="text-base">
            Hand-picked spaces for weddings, conferences, and celebrations.
          </P>
        </View>

        <View className="gap-3">
          <Link href="/venues" asChild>
            <Button>Browse venues</Button>
          </Link>
          <Link href="/login" asChild>
            <Button variant="outline">Sign in</Button>
          </Link>
          <Link href="/signup" asChild>
            <Button variant="ghost">Create account</Button>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
