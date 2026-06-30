import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, H1, H2, P } from "@/components/ui";
import { useMyBookings } from "@/src/hooks/use-data";
import { useAuth } from "@/src/hooks/use-auth";

export default function AccountBookings() {
  const { user } = useAuth();
  const { data, isLoading } = useMyBookings(user?.id ?? null);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="p-5 gap-1">
        <H1>My bookings</H1>
        <P className="opacity-60">Upcoming and past reservations.</P>
      </View>
      {isLoading ? (
        <ActivityIndicator className="mt-10" />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(b) => b.id}
          contentContainerClassName="p-5 gap-3"
          renderItem={({ item }) => (
            <Card>
              <H2>{(item as { venue_name?: string }).venue_name ?? "Venue"}</H2>
              <P className="opacity-60 text-sm mt-1">
                {new Date(item.start_time).toLocaleString()} →{" "}
                {new Date(item.end_time).toLocaleString()}
              </P>
              <P className="mt-2">Status: {item.status}</P>
              <P>
                Total: {item.currency} {(item.total_cents / 100).toLocaleString()}
              </P>
            </Card>
          )}
          ListEmptyComponent={<P className="text-center opacity-60 mt-10">No bookings yet.</P>}
        />
      )}
    </SafeAreaView>
  );
}
