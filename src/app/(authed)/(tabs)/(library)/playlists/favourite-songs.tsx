import { useFetchFavouriteSongs } from "@src/api/useFetchFavouriteSongs";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { MusicButton } from "@src/components/MusicButton";
import { PlaylistStats } from "@src/components/PlaylistStats";
import { Separator } from "@src/components/Separator";
import { ThemedText } from "@src/components/ThemedText";
import { TrackListItem } from "@src/components/TrackListItem";
import { ARTWORK_SIZE } from "@src/constants";
import { useScrollHeader } from "@src/hooks/useScrollHeader";
import { useAuth } from "@src/store/AuthContext";
import { playTracks } from "@src/util/playTracks";
import { useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function PlaylistDetails() {
  // if no id...??
  const navigation = useNavigation();
  const { styles, theme } = useStyles(stylesheet);
  const { api } = useAuth();

  const fetchFavouriteSongs = useFetchFavouriteSongs(api);

  const { scrollHandler } = useScrollHeader({
    navigation,
    title: "Favourite Songs",
    titleStyle: styles.headerTitle,
  });

  const handleOnPressPlay = () => {
    playTracks({ tracks: fetchFavouriteSongs?.data?.tracks });
  };
  const handleOnPressShuffle = () => {
    playTracks({ shuffle: true, tracks: fetchFavouriteSongs?.data?.tracks });
  };
  const handleOnPressPlayTrack = (index: number) => {
    playTracks({
      skipToIndex: index,
      tracks: fetchFavouriteSongs?.data?.tracks,
    });
  };

  if (fetchFavouriteSongs.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <Animated.ScrollView
      contentInsetAdjustmentBehavior="automatic"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={styles.container}
    >
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            alignItems: "center",
            backgroundColor: theme.colors.translucent,
            borderRadius: theme.spacing.md,
            height: 250,
            justifyContent: "center",
            marginRight: theme.spacing.md,
            width: 250,
          }}
        >
          <SymbolView
            name="star.fill"
            resizeMode="scaleAspectFit"
            size={150}
            tintColor={theme.colors.tint}
          />
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <ThemedText type="subtitle">Favourite Songs</ThemedText>
        {/* TODO: user name */}
        {/* TODO: last updated */}
      </View>
      <View style={styles.buttonContainer}>
        <MusicButton onPress={handleOnPressPlay} type="play" />
        <MusicButton onPress={handleOnPressShuffle} type="shuffle" />
      </View>

      <View style={styles.trackListContainer}>
        <Separator />
        {fetchFavouriteSongs?.data?.tracks.map((track, index) => {
          const isLastItem =
            index === fetchFavouriteSongs?.data?.tracks.length - 1;
          return (
            <View key={track.id}>
              <TrackListItem
                onPress={() => handleOnPressPlayTrack(index)}
                track={track}
                trackIndex={index}
                withAlbumName
                withArtwork
              />
              <Separator marginLeft={isLastItem ? 0 : theme.spacing.xxxl} />
            </View>
          );
        })}

        <PlaylistStats playlistSongs={fetchFavouriteSongs.data?.tracks} />
      </View>

      <ListPadding />
    </Animated.ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: { paddingVertical: theme.spacing.md },
  detailsContainer: { alignItems: "center", paddingVertical: theme.spacing.md },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "500",
  },
  image: {
    borderRadius: theme.spacing.md,
    height: ARTWORK_SIZE,
    width: ARTWORK_SIZE,
  },
  imageContainer: { alignItems: "center", ...theme.shadow.sm },
  textDate: { color: theme.colors.secondary, fontSize: 12 },
  trackListContainer: { padding: theme.spacing.lg },
}));
