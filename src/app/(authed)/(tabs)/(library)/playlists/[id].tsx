import { useFetchPlaylistDetails } from "@src/api/useFetchPlaylistDetails";
import { useFetchPlaylistSongs } from "@src/api/useFetchPlaylistSongs";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { MusicButton } from "@src/components/MusicButton";
import { PlaylistStats } from "@src/components/PlaylistStats";
import { Separator } from "@src/components/Separator";
import { ThemedText } from "@src/components/ThemedText";
import { TrackListItem } from "@src/components/TrackListItem";
import { useScrollHeader } from "@src/hooks/useScrollHeader";
import { useAuth } from "@src/store/AuthContext";
import { fmtIsoDate } from "@src/util/date";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { playTracks } from "@src/util/playTracks";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function PlaylistDetails() {
  // if no id...??
  const { id: playlistId } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { styles, theme } = useStyles(stylesheet);
  const { api } = useAuth();

  const fetchPlaylistDetails = useFetchPlaylistDetails(api, playlistId);
  const fetchPlaylistSongs = useFetchPlaylistSongs(api, playlistId);

  const { scrollHandler } = useScrollHeader({
    navigation,
    title: fetchPlaylistDetails?.data?.Name ?? "",
    titleStyle: styles.headerTitle,
  });

  const handleOnPressPlay = () => {
    playTracks({ tracks: fetchPlaylistSongs?.data?.tracks });
  };
  const handleOnPressShuffle = () => {
    playTracks({ shuffle: true, tracks: fetchPlaylistSongs?.data?.tracks });
  };
  const handleOnPressPlayTrack = (index: number) => {
    playTracks({
      skipToIndex: index,
      tracks: fetchPlaylistSongs?.data?.tracks,
    });
  };

  if (fetchPlaylistDetails.isPending || fetchPlaylistSongs.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <Animated.ScrollView
      contentInsetAdjustmentBehavior="automatic"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          contentFit="cover"
          placeholder={{
            blurhash: extractPrimaryHash(
              fetchPlaylistDetails?.data?.ImageBlurHashes,
            ),
          }}
          source={generateArtworkUrl({
            api,
            id: fetchPlaylistDetails?.data?.Id,
          })}
          style={styles.image}
          transition={theme.timing.medium}
        />
      </View>
      <View style={styles.detailsContainer}>
        <ThemedText type="subtitle">
          {fetchPlaylistDetails?.data?.Name}
        </ThemedText>
        {/* TODO: Username?? */}
        {/* <ThemedText style={styles.textArtist}>
          {fetchPlaylistDetails?.data?.AlbumArtist}
        </ThemedText> */}

        <ThemedText style={styles.textDate} type="defaultSemiBold">
          {/* TODO: last updated */}
          {fmtIsoDate(fetchPlaylistDetails.data?.DateCreated)}
        </ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        <MusicButton onPress={handleOnPressPlay} type="play" />
        <MusicButton onPress={handleOnPressShuffle} type="shuffle" />
      </View>

      <View style={styles.trackListContainer}>
        <Separator />
        {fetchPlaylistSongs?.data?.tracks.map((track, index) => {
          const isLastItem =
            index === fetchPlaylistSongs?.data?.tracks.length - 1;
          return (
            <View>
              <TrackListItem
                index={index}
                onPress={() => handleOnPressPlayTrack(index)}
                track={track}
                withAlbumName
                withArtwork
              />
              <Separator marginLeft={isLastItem ? 0 : theme.spacing.xxxl} />
            </View>
          );
        })}

        <PlaylistStats
          playlistDetails={fetchPlaylistDetails?.data}
          playlistSongs={fetchPlaylistSongs.data?.tracks}
        />
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
    height: 300,
    width: 300,
  },
  imageContainer: { alignItems: "center", ...theme.shadow.sm },
  textDate: { color: theme.colors.secondary, fontSize: 12 },
  trackListContainer: { padding: theme.spacing.lg },
}));
