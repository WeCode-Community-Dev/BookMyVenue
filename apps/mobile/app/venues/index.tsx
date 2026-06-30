import { useState } from "react";
import { ActivityIndicator, FlatList, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Card, H2, Input, P } from "@/components/ui";
import { useVenues } from "@/src/hooks/use-data";

export default function VenuesList() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useVenues(search);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-5 pt-3 pb-2">
        <Input placeholder="Search venues, cities…" value={search} onChangeText={setSearch} />
      </View>
      {isLoading ? (
        <ActivityIndicator className="mt-10" />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(v) => v.id}
          contentContainerClassName="p-5 gap-4"
          renderItem={({ item }) => (
            <Link href={{ pathname: "/venues/[id]", params: { id: item.id } }} asChild>
              <Card className="p-0 overflow-hidden">
                {item.cover_image_url && (
                  <Image
                    source={{ uri: item.cover_image_url }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                )}
                <View className="p-4 gap-1">
                  <H2>{item.name}</H2>
                  <P className="text-sm opacity-60">{item.address_data?.city ?? ""}</P>
                  <P className="text-sm mt-1">
                    {item.currency} {(item.base_price_cents / 100).toLocaleString()} / hr
                  </P>
                </View>
              </Card>
            </Link>
          )}
          ListEmptyComponent={<P className="text-center opacity-60 mt-10">No venues found.</P>}
        />
      )}
    </SafeAreaView>
  );
}
