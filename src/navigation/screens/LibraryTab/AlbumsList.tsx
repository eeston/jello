import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { Animated, SafeAreaView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchAlbums } from "../../../api/albums";
import { AlbumCard } from "../../../components/AlbumCard";
import { LoadingOverlay } from "../../../components/Loading";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { useApi } from "../../../store/useJelloAuth";
import { extractPrimaryHash } from "../../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../../util/generateTrackArtworkUrl";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type Props = NativeStackScreenProps<LibraryTabParamList, "AlbumsList">;

export const AlbumsListScreen = ({ navigation }: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const albums = useFetchAlbums(api);
  const headerHeight = useHeaderHeight();

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

  const opacity = useFadeIn([albums]);

  if (albums.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={[styles.container, { marginTop: -headerHeight }]}>
      <Animated.FlatList
        style={{ paddingTop: headerHeight + theme.spacing.sm, opacity }}
        // ListHeaderComponent={<AlbumsHeader />} TODO: hmmmm...
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={albums.data?.Items}
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
