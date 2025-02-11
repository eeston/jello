import { useFetchArtistTopSongs } from "@src/api/useFetchArtistTopSongs";
import { EmptyOverlay } from "@src/components/Empty";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { NoSearchResults } from "@src/components/NoResults";
import { Separator } from "@src/components/Separator";
import { TopTrackListItem } from "@src/components/TopTracksListItem";
import { ROW_HEIGHT } from "@src/constants";
import { useAuth } from "@src/store/AuthContext";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { playTracks } from "@src/util/playTracks";
import { useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// TODO: handle all songs
export default function ArtistTopTracks() {
  const { id: artistId } = useLocalSearchParams<{ id: string }>();

  const { api } = useAuth();
  const { styles } = useStyles(stylesheet);
  const fetchArtistTopSongs = useFetchArtistTopSongs(api, artistId);

  const handleOnPressPlay = (index: number) => {
    playTracks({
      skipToIndex: index,
      tracks: fetchArtistTopSongs?.data?.tracks,
    });
  };

  const renderItem = ({
    index,
    item,
  }: {
    index: number;
    item: JelloTrackItem;
  }) => {
    if (!item.id) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        <TopTrackListItem
          onPress={() => handleOnPressPlay(index)}
          track={item}
        />
      </View>
    );
  };

  if (fetchArtistTopSongs.isPending) {
    return <LoadingOverlay />;
  }

  if (!fetchArtistTopSongs.data?.tracks?.length) {
    return <EmptyOverlay />;
  }

  return (
    <FlatList
      ItemSeparatorComponent={() => <Separator marginLeft={60} />}
      ListEmptyComponent={<NoSearchResults type="Artists" />}
      ListFooterComponent={ListPadding}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={fetchArtistTopSongs?.data?.tracks ?? []}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      windowSize={10}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
}));
