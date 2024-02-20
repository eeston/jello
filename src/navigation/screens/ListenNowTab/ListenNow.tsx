import { useHeaderHeight } from "@react-navigation/elements";
import { Animated, SafeAreaView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import {
  // useFetchFavouriteAlbums,
  useFetchRecentlyPlayedAlbums,
  useFrequentlyPlayedAlbums,
} from "../../../api/albums";
import { AlbumCarousel } from "../../../components/AlbumCarousel";
import { LoadingOverlay } from "../../../components/Loading";
import { useCheckCollectionId } from "../../../hooks/useCollectionId";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { useQueryFocus } from "../../../hooks/useQueryFocus";
import { useApi } from "../../../store/useJelloAuth";

export const ListenNowScreen = () => {
  useQueryFocus();
  useCheckCollectionId();
  const { styles, theme } = useStyles(stylesheet);
  const headerHeight = useHeaderHeight();
  const api = useApi((state) => state.api);
  const recentlyPlayedAlbums = useFetchRecentlyPlayedAlbums(api);
  // const favouriteAlbums = useFetchFavouriteAlbums(api);
  const frequentlyPlayedAlbums = useFrequentlyPlayedAlbums(api);
  // const suggestedAlbums = useFetchSuggestedAlbums(api);

  const opacity = useFadeIn([
    recentlyPlayedAlbums,
    // favouriteAlbums,
    frequentlyPlayedAlbums,
    // suggestedAlbums,
  ]);

  if (
    recentlyPlayedAlbums.isPending ||
    // favouriteAlbums.isPending ||
    frequentlyPlayedAlbums.isPending
    // suggestedAlbums.isPending
  ) {
    return <LoadingOverlay />;
  }

  // TODO: some copy for an empty screen?

  return (
    <SafeAreaView style={[styles.container, { marginTop: -headerHeight }]}>
      <Animated.ScrollView
        style={{ paddingTop: headerHeight + theme.spacing.sm, opacity }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {/*
          Look into suggestions API.
          <AlbumCarousel request={suggestedAlbums} title="Top Picks" />
        */}
        <AlbumCarousel request={recentlyPlayedAlbums} title="Recently Played" />

        {/*
          This messes up because there are multiple favouritable items.
          Split up albums/artists here. Add favourite songs as a "smart playlist" like AM
          <AlbumCarousel request={favouriteAlbums} title="Favourites" />
        */}
        <AlbumCarousel
          request={frequentlyPlayedAlbums}
          title="Frequently Played"
        />
        <View style={{ height: headerHeight + 200 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
}));
