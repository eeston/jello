import { useFetchFavouriteAlbums } from "@src/api/useFetchFavouriteAlbums";
import { useFetchFrequentlyPlayedAlbums } from "@src/api/useFetchFrequentlyPlayedAlbums";
import { useFetchRecentlyPlayedAlbums } from "@src/api/useFetchRecentlyPlayedAlbums";
import { useFetchSuggestedAlbums } from "@src/api/useFetchSuggestedAlbums";
import { AlbumCarousel } from "@src/components/AlbumCarousel";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { useAuth } from "@src/store/AuthContext";
import { delay } from "@src/util/delay";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Home() {
  const { styles, theme } = useStyles(stylesheet);
  const { api } = useAuth();
  const queryClient = useQueryClient();
  const fetchRecentlyPlayedAlbums = useFetchRecentlyPlayedAlbums(api);
  const fetchFrequentlyPlayedAlbums = useFetchFrequentlyPlayedAlbums(api);
  const fetchFavouriteAlbums = useFetchFavouriteAlbums(api);
  const fetchSuggestedAlbums = useFetchSuggestedAlbums(api);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOnRefresh = async () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries();
    await delay(theme.timing.slow);
    setIsRefreshing(false);
  };

  if (
    fetchRecentlyPlayedAlbums.isPending ||
    fetchFrequentlyPlayedAlbums.isPending ||
    fetchFavouriteAlbums.isPending ||
    fetchSuggestedAlbums.isPending
  ) {
    return <LoadingOverlay />;
  }

  // TODO: some copy for an empty screen?

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl onRefresh={handleOnRefresh} refreshing={isRefreshing} />
      }
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {/* Suggested albums */}
      <AlbumCarousel
        identifier="AlbumId"
        large
        pathname="home"
        request={fetchSuggestedAlbums}
        title="Top Picks for You"
      />

      {/* Recently played albums */}
      <AlbumCarousel
        identifier="AlbumId"
        pathname="home"
        request={fetchRecentlyPlayedAlbums}
        title="Recently Played"
      />

      {/* Top played albums */}
      <AlbumCarousel
        identifier="AlbumId"
        pathname="home"
        request={fetchFrequentlyPlayedAlbums}
        title="Frequently Played"
      />

      {/* Favourite albums */}
      <AlbumCarousel
        identifier="Id"
        pathname="home"
        request={fetchFavouriteAlbums}
        title="Favourite Albums"
      />
      <ListPadding />
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    //
  },
}));
