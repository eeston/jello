import { useFetchArtistAlbums } from "@src/api/useFetchArtistAlbums";
import { useFetchArtistDetails } from "@src/api/useFetchArtistDetails";
import { useFetchArtistFavouriteAlbums } from "@src/api/useFetchArtistFavouriteAlbums";
import { useFetchArtistTopSongs } from "@src/api/useFetchArtistTopSongs";
import { AlbumCarousel } from "@src/components/AlbumCarousel";
import { ArtworkView } from "@src/components/ArtworkView";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/Loading";
import { ThemedText } from "@src/components/ThemedText";
import { TopTracksList } from "@src/components/TopTracksList";
import { useAuth } from "@src/store/AuthContext";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";
import TrackPlayer from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function ArtistDetails() {
  // if no id...
  const { id: artistId } = useLocalSearchParams<{ id: string }>();

  const { styles, theme } = useStyles(stylesheet);
  const { api } = useAuth();
  const fetchArtistDetails = useFetchArtistDetails(api, artistId);
  const fetchArtistAlbums = useFetchArtistAlbums(api, artistId);
  const fetchArtistFavouriteAlbums = useFetchArtistFavouriteAlbums(
    api,
    artistId,
  );
  const fetchArtistTopSongs = useFetchArtistTopSongs(api, artistId);

  const handleOnPress = () => {
    TrackPlayer.reset();
    TrackPlayer.add(fetchArtistTopSongs?.data?.tracks ?? [], 0);
    TrackPlayer.play();
  };

  if (
    fetchArtistDetails.isPending ||
    fetchArtistAlbums.isPending ||
    fetchArtistFavouriteAlbums.isPending ||
    fetchArtistTopSongs.isPending
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
              fetchArtistDetails?.data?.ImageBlurHashes,
            ),
          }}
          recyclingKey={fetchArtistDetails?.data?.Id}
          source={generateArtworkUrl({
            api,
            id: fetchArtistDetails?.data?.Id,
          })}
          style={styles.image}
          transition={theme.timing.medium}
        />
      }
      headerOverlay={
        <View style={styles.headerOverlayContainer}>
          <ThemedText style={styles.text} type="title">
            {fetchArtistDetails?.data?.Name}
          </ThemedText>
          <Pressable onPress={handleOnPress}>
            <SymbolView
              colors={["white", "red"]}
              name="play.circle.fill"
              resizeMode="scaleAspectFit"
              size={36}
              type="palette"
            />
          </Pressable>
        </View>
      }
      smallBlur
      title={fetchArtistDetails?.data?.Name}
    >
      <View style={styles.contentContainer}>
        <TopTracksList tracks={fetchArtistTopSongs?.data?.tracks} />

        {/* Favourite Albums */}
        <AlbumCarousel
          identifier="Id"
          large
          pathname="library"
          request={fetchArtistFavouriteAlbums}
          title="Essential Albums"
        />

        {/* All Albums */}
        <AlbumCarousel
          identifier="Id"
          pathname="library"
          request={fetchArtistAlbums}
          title="Albums"
        />
      </View>
      <ListPadding />
    </ArtworkView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  contentContainer: {
    paddingBottom: theme.spacing.xxxl,
  },
  headerOverlayContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing.md,
  },
  image: { flex: 1 },
  text: { color: "white" },
}));
