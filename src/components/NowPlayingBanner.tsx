import { ThemedText } from "@src/components/ThemedText";
import { useTrackedActiveTrack } from "@src/hooks/useTrackedActiveTrack";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, { useIsPlaying } from "react-native-track-player";
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from "react-native-unistyles";

const PlayIndicator = ({
  isLoading,
  isPlaying,
}: {
  isLoading: boolean;
  isPlaying: boolean;
}) => {
  const { theme } = useStyles();
  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <SymbolView
      name={isPlaying ? "pause.fill" : "play.fill"}
      resizeMode="scaleAspectFit"
      size={24}
      tintColor={theme.colors.primary}
    />
  );
};

export const NowPlayingBanner = () => {
  const { styles, theme } = useStyles(stylesheet);
  const insets = useSafeAreaInsets();
  const { bufferingDuringPlay: isLoading, playing: isPlaying } = useIsPlaying();
  const currentTrack = useTrackedActiveTrack();

  const bottomPosition = insets.bottom + 57;

  const handleOnPressPlayPause = () => {
    if (isPlaying) {
      return TrackPlayer.pause();
    } else {
      return TrackPlayer.play();
    }
  };

  const handleOnPressNext = () => {
    TrackPlayer.skipToNext();
  };

  return (
    <Link
      asChild
      disabled={!currentTrack}
      href="/(authed)/nowPlaying"
      style={[styles.container, { bottom: bottomPosition }]}
    >
      <Pressable style={[styles.container, { bottom: bottomPosition }]}>
        <BlurView
          intensity={100}
          style={styles.content}
          tint={UnistylesRuntime.themeName}
        >
          <View style={styles.miniPlayerContent}>
            {currentTrack?.artworkBlur || currentTrack?.artwork ? (
              <Image
                placeholder={{
                  blurhash: currentTrack?.artworkBlur,
                }}
                source={{ uri: currentTrack?.artwork }}
                style={styles.artwork}
                transition={theme.timing.medium}
              />
            ) : (
              <View
                style={[
                  styles.artwork,
                  {
                    alignItems: "center",
                    backgroundColor: "lightgrey",
                    justifyContent: "center",
                  },
                ]}
              >
                <SymbolView
                  name="music.note"
                  resizeMode="scaleAspectFit"
                  tintColor="grey"
                />
              </View>
            )}
            <View style={styles.textContainer}>
              <ThemedText
                numberOfLines={1}
                style={styles.title}
                type="defaultSemiBold"
              >
                {currentTrack?.title ?? "Not Playing"}
              </ThemedText>
              {currentTrack?.artist && (
                <ThemedText numberOfLines={1} style={styles.title}>
                  {currentTrack?.artist}
                </ThemedText>
              )}
            </View>
            <View style={styles.controls}>
              <Pressable
                disabled={isLoading}
                onPress={handleOnPressPlayPause}
                style={styles.controlButton}
              >
                <PlayIndicator isLoading={isLoading} isPlaying={!!isPlaying} />
              </Pressable>
              <Pressable
                disabled={isLoading}
                onPress={handleOnPressNext}
                style={styles.controlButton}
              >
                <SymbolView
                  name="forward.fill"
                  resizeMode="scaleAspectFit"
                  size={32}
                  tintColor={theme.colors.primary}
                />
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Link>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  artwork: {
    borderRadius: theme.spacing.xs,
    height: 40,
    width: 40,
  },
  container: {
    height: 56,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 50,
    ...theme.shadow.sm,
  },
  content: {
    alignItems: "center",
    borderRadius: theme.spacing.sm,
    flex: 1,
    flexDirection: "row",
    marginHorizontal: theme.spacing.xs,
    overflow: "hidden",
    zIndex: 1000,
  },
  controlButton: {
    padding: theme.spacing.xs,
  },
  controls: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  miniPlayerContent: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    height: "100%",
    paddingHorizontal: theme.spacing.xs,
  },
  textContainer: {
    backgroundColor: "transparent",
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  title: {
    lineHeight: 20,
  },
}));
