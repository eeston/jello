import { useFetchAlbumDetails } from "@src/api/useFetchAlbumDetails";
import { useFetchAlbumSongs } from "@src/api/useFetchAlbumSongs";
import { useFetchMoreArtistAlbums } from "@src/api/useFetchMoreArtistAlbums";
import { AlbumCarousel } from "@src/components/AlbumCarousel";
import { AlbumStats } from "@src/components/AlbumStats";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { MusicButton } from "@src/components/MusicButton";
import { ThemedText } from "@src/components/ThemedText";
import { TrackList } from "@src/components/TrackList";
import { useScrollHeader } from "@src/hooks/useScrollHeader";
import { useAuth } from "@src/store/AuthContext";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { playTracks } from "@src/util/playTracks";
import { Image } from "expo-image";
import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useSegments,
} from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function AlbumDetails() {
  // if no id...??
  const { id: albumId } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { styles, theme } = useStyles(stylesheet);
  const { api } = useAuth();
  const fetchAlbumDetails = useFetchAlbumDetails(api, albumId);
  const fetchAlbumSongs = useFetchAlbumSongs(api, albumId);
  const fetchMoreAlbums = useFetchMoreArtistAlbums(
    api,
    fetchAlbumDetails?.data?.ParentId,
    fetchAlbumDetails?.data?.Id,
  );
  const segments = useSegments() as string[];
  const isLibrary = segments.includes("(library)");

  const { scrollHandler } = useScrollHeader({
    navigation,
    title: fetchAlbumDetails?.data?.Name ?? "",
    titleStyle: styles.headerTitle,
  });

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
              fetchAlbumDetails?.data?.ImageBlurHashes,
            ),
          }}
          source={generateArtworkUrl({
            api,
            id: fetchAlbumDetails?.data?.Id,
          })}
          style={styles.image}
          transition={theme.timing.medium}
        />
      </View>
      <View style={styles.detailsContainer}>
        <ThemedText type="subtitle">{fetchAlbumDetails?.data?.Name}</ThemedText>
        <Link
          asChild
          href={{
            params: { id: fetchAlbumDetails?.data?.ParentId ?? "" },
            pathname: "/artists/[id]",
          }}
          push
        >
          <TouchableOpacity>
            <ThemedText style={styles.textArtist}>
              {fetchAlbumDetails?.data?.AlbumArtist}
            </ThemedText>
          </TouchableOpacity>
        </Link>

        <ThemedText style={styles.textGenres} type="defaultSemiBold">
          {!!fetchAlbumDetails?.data?.Genres?.length &&
            `${fetchAlbumDetails?.data?.Genres?.map((genre) => genre).join(", ")} • `}
          {fetchAlbumDetails?.data?.ProductionYear}
        </ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        <MusicButton onPress={handleOnPressPlay} type="play" />
        <MusicButton onPress={handleOnPressShuffle} type="shuffle" />
      </View>

      <View style={styles.trackListContainer}>
        <TrackList tracks={fetchAlbumSongs?.data?.tracks} />
        <AlbumStats
          albumDetails={fetchAlbumDetails?.data}
          albumSongs={fetchAlbumSongs.data?.tracks}
        />
      </View>
      <AlbumCarousel
        identifier="Id"
        pathname={isLibrary ? "library" : "home"}
        replace
        request={fetchMoreAlbums}
        title={`More by ${fetchAlbumDetails?.data?.AlbumArtist}...`}
      />
      {/* TODO: */}
      {/* Featured On... */}
      {/* You Might Also Like... */}
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
  textArtist: { color: theme.colors.tint, fontSize: 20 },
  textGenres: { color: theme.colors.secondary, fontSize: 12 },
  trackListContainer: { padding: theme.spacing.lg },
}));
