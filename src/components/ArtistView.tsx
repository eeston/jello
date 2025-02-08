import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import MaskedView from "@react-native-masked-view/masked-view";
import { useNavigation } from "@react-navigation/native";
import { useFetchArtistAlbums } from "@src/api/useFetchArtistAlbums";
import { useFetchArtistFavouriteAlbums } from "@src/api/useFetchArtistFavouriteAlbums";
import { useFetchArtistTopSongs } from "@src/api/useFetchArtistTopSongs";
import { AlbumCarousel } from "@src/components/AlbumCarousel";
import { ListPadding } from "@src/components/ListPadding";
import { ThemedText } from "@src/components/ThemedText";
import { TopTracksList } from "@src/components/TopTracksList";
import { useAuth } from "@src/store/AuthContext";
import { playTracks } from "@src/util/playTracks";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { useLayoutEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const HEADER_HEIGHT = Dimensions.get("window").width;
export const ArtistView = ({
  artistId,
  artistName,
  headerImageBlurhash,
  headerImageUrl,
}: {
  artistId: string;
  artistName: BaseItemDto["Name"];
  headerImageBlurhash: string;
  headerImageUrl: string;
}) => {
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const { styles, theme } = useStyles(stylesheet);
  const { api } = useAuth();

  const fetchArtistAlbums = useFetchArtistAlbums(api, artistId);
  const fetchArtistFavouriteAlbums = useFetchArtistFavouriteAlbums(
    api,
    artistId,
  );
  const fetchArtistTopSongs = useFetchArtistTopSongs(api, artistId);

  const isLoadingArtistContent =
    fetchArtistAlbums.isLoading ||
    fetchArtistFavouriteAlbums.isLoading ||
    fetchArtistTopSongs.isLoading;

  const handleOnPressPlay = () => {
    playTracks({ tracks: fetchArtistTopSongs?.data?.tracks });
  };

  // Generate gradient colors and locations
  const { colors, locations } = easeGradient({
    colorStops: {
      0: { color: "transparent" },
      0.5: { color: "rgba(0,0,0,0.99)" },
      1: { color: "black" },
    },
  });

  const headerFadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [HEADER_HEIGHT * 0.6, HEADER_HEIGHT * 0.8],
      [0, 1],
      "clamp",
    ),
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View style={[StyleSheet.absoluteFill, headerFadeStyle]}>
          <BlurView style={StyleSheet.absoluteFill} tint="prominent" />
        </Animated.View>
      ),
      headerTitle: () => (
        <Animated.Text style={[styles.headerTitle, headerFadeStyle]}>
          {artistName}
        </Animated.Text>
      ),
      headerTransparent: true,
    });
  }, [navigation, artistName, headerFadeStyle]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [HEADER_HEIGHT * 0.4, HEADER_HEIGHT * 0.8],
        [1, 0],
        "clamp",
      ),
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, 0],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Image
            contentFit="cover"
            placeholder={{
              blurhash: headerImageBlurhash,
            }}
            recyclingKey={headerImageUrl}
            source={headerImageUrl}
            style={styles.image}
            transition={theme.timing.medium}
          />
          <View style={styles.blurContainer}>
            <MaskedView
              maskElement={
                <LinearGradient
                  colors={colors}
                  locations={locations}
                  style={StyleSheet.absoluteFill}
                />
              }
              style={StyleSheet.absoluteFill}
            >
              <BlurView style={StyleSheet.absoluteFill} tint="dark" />
            </MaskedView>
            <View style={styles.overlayContent}>
              <View style={styles.headerOverlayContainer}>
                <ThemedText style={styles.text} type="title">
                  {artistName}
                </ThemedText>
                <Pressable
                  disabled={isLoadingArtistContent}
                  onPress={handleOnPressPlay}
                >
                  <SymbolView
                    colors={["white", "red"]}
                    name="play.circle.fill"
                    resizeMode="scaleAspectFit"
                    size={36}
                    type="palette"
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </Animated.View>
        {isLoadingArtistContent ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <View>
            {/* Top Played Tracks */}
            {/* Add a new screen with full ordered list */}
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

            {/* TODO: */}
            {/* Appears On */}
            {/* About {...} */}
            {/* Similar Artists */}
            <ListPadding />
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  blurContainer: {
    bottom: 0,
    height: theme.spacing.xxl * 2,
    left: 0,
    position: "absolute",
    right: 0,
    // zIndex: 2,
  },
  container: {
    flex: 1,
  },
  content: {
    // paddingHorizontal: theme.spacing.md,
    // overflow: "hidden",
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
  },
  headerOverlayContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  image: { flex: 1 },
  loadingContainer: { paddingTop: theme.spacing.xxxl },
  overlayContent: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 3,
  },
  scrollContent: {
    paddingTop: 0,
  },
  text: { color: "white" },
}));
