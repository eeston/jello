import { useFetchAlbumDetails } from "@src/api/useFetchAlbumDetails";
import { useFetchAlbumSongs } from "@src/api/useFetchAlbumSongs";
import { useFetchMoreArtistAlbums } from "@src/api/useFetchMoreArtistAlbums";
import { AlbumCarousel } from "@src/components/AlbumCarousel";
import { AlbumStats } from "@src/components/AlbumStats";
import { AlbumTitleDetails } from "@src/components/AlbumTitleDetails";
import { ArtworkView } from "@src/components/ArtworkView";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/Loading";
import { MusicButton } from "@src/components/MusicButton";
import { TrackList } from "@src/components/TrackList";
import { useAuth } from "@src/store/AuthContext";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { playTracks } from "@src/util/playTracks";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import TrackPlayer from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function AlbumDetails() {
  // if no id...??
  const { id: albumId } = useLocalSearchParams<{ id: string }>();

  const { styles, theme } = useStyles(stylesheet);
  const { api } = useAuth();
  const fetchAlbumDetails = useFetchAlbumDetails(api, albumId);
  const fetchAlbumSongs = useFetchAlbumSongs(api, albumId);
  const fetchMoreAlbums = useFetchMoreArtistAlbums(
    api,
    fetchAlbumDetails?.data?.ParentId,
    fetchAlbumDetails?.data?.Id,
  );

  const handleOnPressPlay = () => {
    playTracks({ tracks: fetchAlbumSongs?.data?.tracks });
  };
  const handleOnPressShuffle = () => {
    playTracks({ shuffle: true, tracks: fetchAlbumSongs?.data?.tracks });
  };

  if (
    fetchAlbumDetails.isPending ||
    fetchAlbumSongs.isPending ||
    fetchMoreAlbums.isPending
  ) {
    return <LoadingOverlay />;
  }

  return (
    <ArtworkView
      headerImage={
        <Image
          contentFit="cover"
          placeholder={{
            blurhash: extractPrimaryHash(
              fetchAlbumDetails?.data?.ImageBlurHashes,
            ),
          }}
          recyclingKey={fetchAlbumDetails?.data?.Id}
          source={generateArtworkUrl({
            api,
            id: fetchAlbumDetails?.data?.Id,
          })}
          style={styles.image}
          transition={theme.timing.medium}
        />
      }
      headerOverlay={
        <View style={styles.headerOverlayContainer}>
          <View style={styles.headerDetailsContainer}>
            <AlbumTitleDetails albumDetails={fetchAlbumDetails?.data} />
          </View>
          <View style={styles.headerButtonContainer}>
            <MusicButton onPress={handleOnPressPlay} type="play" />
            <MusicButton onPress={handleOnPressShuffle} type="shuffle" />
          </View>
        </View>
      }
      title={fetchAlbumDetails?.data?.Name}
    >
      <View style={styles.contentContainer}>
        <TrackList tracks={fetchAlbumSongs?.data?.tracks} />
        <AlbumStats
          albumDetails={fetchAlbumDetails?.data}
          albumSongs={fetchAlbumSongs.data?.tracks}
        />
      </View>
      <AlbumCarousel
        identifier="Id"
        pathname="library"
        replace
        request={fetchMoreAlbums}
        title={`More by ${fetchAlbumDetails?.data?.AlbumArtist}...`}
      />
      <ListPadding />
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
  smallText: { color: "white", fontSize: 12, lineHeight: 14 },
  text: { color: "white", lineHeight: 20 },
}));
