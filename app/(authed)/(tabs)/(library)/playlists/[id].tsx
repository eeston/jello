import { useFetchPlaylistDetails } from "@src/api/useFetchPlaylistDetails";
import { useFetchPlaylistSongs } from "@src/api/useFetchPlaylistSongs";
import { ArtworkView } from "@src/components/ArtworkView";
import { LoadingOverlay } from "@src/components/Loading";
import { MusicButton } from "@src/components/MusicButton";
import { PlaylistStats } from "@src/components/PlaylistStats";
import { ThemedText } from "@src/components/ThemedText";
import { TrackList } from "@src/components/TrackList";
import { useAuth } from "@src/store/AuthContext";
import { fmtIsoDate } from "@src/util/date";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { playTracks } from "@src/util/playTracks";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function PlaylistDetails() {
  // if no id...
  const { id: playlistId } = useLocalSearchParams<{ id: string }>();
  const { styles, theme } = useStyles(stylesheet);
  const { api } = useAuth();

  const fetchPlaylistDetails = useFetchPlaylistDetails(api, playlistId);
  const fetchPlaylistSongs = useFetchPlaylistSongs(api, playlistId);

  if (fetchPlaylistDetails.isPending || fetchPlaylistSongs.isPending) {
    return <LoadingOverlay />;
  }
  const handleOnPressPlay = () => {
    playTracks({ tracks: fetchPlaylistSongs?.data?.tracks });
  };
  const handleOnPressShuffle = () => {
    playTracks({ shuffle: true, tracks: fetchPlaylistSongs?.data?.tracks });
  };

  return (
    <ArtworkView
      headerImage={
        <Image
          contentFit="cover"
          placeholder={{
            blurhash: extractPrimaryHash(
              fetchPlaylistDetails?.data?.ImageBlurHashes,
            ),
          }}
          recyclingKey={fetchPlaylistDetails?.data?.Id}
          source={generateArtworkUrl({
            api,
            id: fetchPlaylistDetails?.data?.Id,
          })}
          style={styles.image}
          transition={theme.timing.medium}
        />
      }
      headerOverlay={
        <View style={styles.headerOverlayContainer}>
          <View style={styles.headerDetailsContainer}>
            <ThemedText style={styles.text} type="subtitle">
              {fetchPlaylistDetails?.data?.Name}
            </ThemedText>
            <ThemedText style={styles.smallText}>
              {fmtIsoDate(fetchPlaylistDetails.data?.DateCreated)}
            </ThemedText>
          </View>
          <View style={styles.headerButtonContainer}>
            <MusicButton onPress={handleOnPressPlay} type="play" />
            <MusicButton onPress={handleOnPressShuffle} type="shuffle" />
          </View>
        </View>
      }
      title={fetchPlaylistDetails?.data?.Name}
    >
      <View style={styles.contentContainer}>
        <TrackList isPlaylist tracks={fetchPlaylistSongs?.data?.tracks} />
        <PlaylistStats
          playlistDetails={fetchPlaylistDetails?.data}
          playlistSongs={fetchPlaylistSongs.data?.tracks}
        />
      </View>
    </ArtworkView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  contentContainer: { paddingHorizontal: theme.spacing.md },
  headerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerDetailsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xs,
  },
  headerOverlayContainer: { padding: theme.spacing.md },
  image: { flex: 1 },
  smallText: { color: "white", fontSize: 14 },
  text: { color: "white" },
}));
