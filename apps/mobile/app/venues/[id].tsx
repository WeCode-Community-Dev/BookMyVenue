import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Button, Card, H1, H2, P } from "@/components/ui";
import { useVenue } from "@/src/hooks/use-data";

export default function VenueDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: venue, isLoading } = useVenue(id);

  if (isLoading || !venue) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="pb-10">
        {venue.cover_image_url && (
          <Image
            source={{ uri: venue.cover_image_url }}
            className="w-full h-64"
            resizeMode="cover"
          />
        )}
        <View className="p-5 gap-5">
          <View className="gap-1">
            <P className="uppercase tracking-widest text-xs opacity-60">{venue.venue_type}</P>
            <H1>{venue.name}</H1>
            <P className="opacity-60">Up to {venue.capacity} guests</P>
          </View>

          <Card>
            <View className="flex-row items-baseline justify-between">
              <H2>
                {venue.currency} {(venue.base_price_cents / 100).toLocaleString()}
              </H2>
              <P className="opacity-60">per hour</P>
            </View>
            <Button className="mt-4">Request to book</Button>
          </Card>

          {venue.description ? (
            <View className="gap-2">
              <H2>About this space</H2>
              <P>{venue.description}</P>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
