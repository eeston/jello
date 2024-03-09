import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { Animated, SafeAreaView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchArtistSongs } from "../../../api/albums";
import {
  useFetchArtistAlbums,
  useFetchArtistDetails,
} from "../../../api/artists";
import { AlbumCard } from "../../../components/AlbumCard";
import { ArtistHeader } from "../../../components/ArtistDetails/Header";
import { LoadingOverlay } from "../../../components/Loading";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { useApi } from "../../../store/useJelloAuth";
import { extractPrimaryHash } from "../../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../../util/generateTrackArtworkUrl";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type Props = NativeStackScreenProps<LibraryTabParamList, "ArtistDetails">;

export const ArtistDetailsScreen = ({ route, navigation }: Props) => {
  const { artistId } = route?.params;
  // if no id...
  const { styles, theme } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const artistDetails = useFetchArtistDetails(api, artistId);
  const artistAlbums = useFetchArtistAlbums(api, artistId);
  const artistSongs = useFetchArtistSongs(api, artistId);

  const headerHeight = useHeaderHeight();

  const onPressArtistItem = useCallback(
    (albumId: string) => {
      navigation.navigate("AlbumDetails", { albumId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: BaseItemDto }) => (
      <AlbumCard
        title={item?.Name ?? "Unknown Album"}
        subTitle={item?.ProductionYear ?? "Unknown Year"}
        imageUrl={generateTrackArtworkUrl({ id: item.Id, api })}
        imageHash={extractPrimaryHash(item?.ImageBlurHashes)}
        onPress={() => onPressArtistItem(item.Id)}
      />
    ),
    [api, onPressArtistItem],
  );

  const opacity = useFadeIn([artistDetails, artistAlbums]);

  if (
    artistDetails.isPending ||
    artistAlbums.isPending ||
    artistSongs.isPending
  ) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={[styles.container, { marginTop: -headerHeight }]}>
      <Animated.FlatList
        ListHeaderComponent={
          <ArtistHeader
            artistDetails={artistDetails.data}
            artistSongs={artistSongs.data?.Items}
          />
        }
        ListFooterComponent={<View style={styles.listFooterContainer} />}
        data={artistAlbums.data?.Items}
        renderItem={renderItem}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: headerHeight + theme.spacing.sm, opacity }}
        columnWrapperStyle={styles.listColumnWrapper}
      />
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  listFooterContainer: { height: theme.spacing.xxxl * 4 },
  listColumnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
}));
