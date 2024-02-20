import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { Animated, SafeAreaView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchGenreAlbums } from "../../../api/genres";
import { AlbumCard } from "../../../components/AlbumCard";
import { LoadingOverlay } from "../../../components/Loading";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { useApi } from "../../../store/useJelloAuth";
import { extractPrimaryHash } from "../../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../../util/generateTrackArtworkUrl";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type Props = NativeStackScreenProps<LibraryTabParamList, "GenreDetails">;

export const GenreDetailsScreen = ({ route, navigation }: Props) => {
  const { genreId } = route.params;
  // if no id...

  const { theme } = useStyles(stylesheet);
  const headerHeight = useHeaderHeight();
  const api = useApi((state) => state.api);
  const genreDetails = useFetchGenreAlbums(api, genreId);
  const { styles } = useStyles(stylesheet);

  const onPressAlbumItem = useCallback(
    (albumId: string) => {
      return navigation.navigate("AlbumDetails", { albumId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: BaseItemDto }) => (
      <AlbumCard
        title={item.Name ?? "Unknown Album"}
        subTitle={item.AlbumArtist ?? "Unknown Artist"}
        imageUrl={generateTrackArtworkUrl({ id: item.Id, api })}
        imageHash={extractPrimaryHash(item.ImageBlurHashes)}
        onPress={() => onPressAlbumItem(item.Id)}
      />
    ),
    [api, onPressAlbumItem],
  );

  const opacity = useFadeIn([genreDetails]);

  if (genreDetails.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={[styles.container, { marginTop: -headerHeight }]}>
      <Animated.FlatList
        style={{ paddingTop: headerHeight + theme.spacing.sm, opacity }}
        // ListHeaderComponent={<AlbumsHeader />} TODO: hmmmm...
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={genreDetails.data?.Items}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.Id}
        ListFooterComponent={<View style={{ height: headerHeight + 200 }} />}
      />
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
}));
