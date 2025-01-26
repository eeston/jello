import NowPlayingBackground from "@src/components/NowPlayingBackground";
import { ThemedText } from "@src/components/ThemedText";
import { useSpringAnimation } from "@src/hooks/useSpringAnimation";
import { useTrackedActiveTrack } from "@src/hooks/useTrackedActiveTrack";
import { useAudioStore } from "@src/store/audioStore";
import { secondsToMmSs } from "@src/util/time";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { ActivityIndicator, Animated, Pressable, View } from "react-native";
import TrackPlayer, {
  useIsPlaying,
  useProgress,
} from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function NowPlayingModal() {
  const { styles, theme } = useStyles(stylesheet);
  const currentTrack = useTrackedActiveTrack();
  const { playing: isPlaying } = useIsPlaying();
  const { duration, position } = useProgress();

  const { isLoading } = useAudioStore();

  // eslint-disable-next-line react-compiler/react-compiler
  const albumArtworkScale = useRef(new Animated.Value(1)).current;
  useSpringAnimation(albumArtworkScale, isPlaying ? 1.0 : 0.7, {
    bounciness: isPlaying ? 10 : 1,
    speed: 3,
  });

  const handleOnPressSkipForward = () => {
    if (currentTrack) {
      TrackPlayer.skipToNext();
    }
  };

  const handleOnPressSkipBackward = () => {
    if (currentTrack) {
      TrackPlayer.skipToPrevious();
    }
  };

  const handleOnPressTogglePlayPause = () => {
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  const progress = (duration ?? 0) > 0 ? (position / (duration ?? 0)) * 100 : 0;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.artworkContainer}>
          <Animated.View style={{ transform: [{ scale: albumArtworkScale }] }}>
            <Image
              contentFit="cover"
              placeholder={{
                blurhash: currentTrack?.artworkBlur,
              }}
              source={{ uri: currentTrack?.artwork }}
              style={styles.artwork}
              transition={theme.timing.medium}
            />
          </Animated.View>
        </View>

        {/* TRACK TITLE */}
        <View style={styles.titleContainer}>
          <View>
            <ThemedText
              numberOfLines={1}
              style={{ color: "white" }}
              type="subtitle"
            >
              {currentTrack?.title}
            </ThemedText>
            <ThemedText
              style={{ color: "rgba(255, 255, 255, 0.4)" }}
              type="defaultSemiBold"
            >
              {currentTrack?.artist}
            </ThemedText>
          </View>
          {/* TODO */}
          {/* <View style={styles.titleIcons}>
            <Pressable style={styles.iconButton}>
              <SymbolView
                name="star"
                resizeMode="scaleAspectFit"
                size={18}
                tintColor="white"
              />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <SymbolView
                name="ellipsis"
                resizeMode="scaleAspectFit"
                size={18}
                tintColor="white"
              />
            </Pressable>
          </View> */}
        </View>

        {/* PROGRESS */}
        {/* TODO: change for live */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress}%` }]} />
          </View>

          {!currentTrack?.isLiveStream && (
            <View style={styles.timeContainer}>
              <ThemedText style={styles.timeText}>
                {secondsToMmSs(position)}
              </ThemedText>
              <ThemedText style={styles.timeText}>
                -{secondsToMmSs(Math.max(0, duration ?? 0 - position))}
              </ThemedText>
            </View>
          )}
        </View>

        {/* CONTROLS */}
        <View style={styles.controlsContainer}>
          {!currentTrack?.isLiveStream && (
            <Pressable
              disabled={currentTrack?.isLiveStream}
              onPress={handleOnPressSkipBackward}
              style={styles.button}
            >
              <SymbolView
                name="backward.fill"
                resizeMode="scaleAspectFit"
                size={40}
                tintColor={currentTrack?.isLiveStream ? "grey" : "white"}
              />
            </Pressable>
          )}
          <Pressable
            disabled={isLoading}
            onPress={handleOnPressTogglePlayPause}
            style={styles.button}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size={32} />
            ) : (
              <SymbolView
                name={isPlaying ? "pause.fill" : "play.fill"}
                resizeMode="scaleAspectFit"
                size={40}
                tintColor="white"
              />
            )}
          </Pressable>
          {!currentTrack?.isLiveStream && (
            <Pressable onPress={handleOnPressSkipForward} style={styles.button}>
              <SymbolView
                name="forward.fill"
                resizeMode="scaleAspectFit"
                size={40}
                tintColor="white"
              />
            </Pressable>
          )}
        </View>
      </View>

      <NowPlayingBackground blurhash={currentTrack?.artworkBlur} />
    </>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  artwork: {
    borderRadius: 8,
    height: runtime.screen.width - 52,
    width: runtime.screen.width - 52,
  },
  artworkContainer: {
    ...theme.shadow.lg,
  },
  button: {
    padding: theme.spacing.sm,
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 50,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    paddingTop: theme.spacing.lg,
  },

  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.lg,
    width: "100%",
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    height: 28,
    justifyContent: "center",
    width: 28,
  },

  progress: {
    backgroundColor: "#ffffff6a",
    borderBottomRightRadius: 0,
    borderRadius: 5,
    borderTopRightRadius: 0,
    height: "100%",
    width: "30%",
  },

  //
  progressBar: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    height: 6,
    marginTop: theme.spacing.xl,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.xl,
    width: "100%",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "white",
    fontSize: 12,
    opacity: 0.6,
  },
  title: {
    // flex: 1,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    width: "100%",
  },
  titleIcons: {
    flexDirection: "row",
    gap: 15,
  },
}));
