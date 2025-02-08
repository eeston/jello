import NowPlayingBackground from "@src/components/NowPlayingBackground";
import { NowPlayingMediaControls } from "@src/components/NowPlayingScreen//NowPlayingMediaControls";
import { NowPlayingBottomControls } from "@src/components/NowPlayingScreen/NowPlayingBottomControls";
import { NowPlayingProgress } from "@src/components/NowPlayingScreen/NowPlayingProgress";
import { NowPlayingTitle } from "@src/components/NowPlayingScreen/NowPlayingTitle";
import { NowPlayingVolume } from "@src/components/NowPlayingScreen/NowPlayingVolume";
import { useSpringAnimation } from "@src/hooks/useSpringAnimation";
import { useTrackedActiveTrack } from "@src/hooks/useTrackedActiveTrack";
import { Image } from "expo-image";
import { useRef } from "react";
import { Animated, View } from "react-native";
import { useIsPlaying } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function NowPlayingModal() {
  const { styles, theme } = useStyles(stylesheet);
  const currentTrack = useTrackedActiveTrack();
  const { playing: isPlaying } = useIsPlaying();

  // eslint-disable-next-line react-compiler/react-compiler
  const albumArtworkScale = useRef(new Animated.Value(1)).current;
  useSpringAnimation(albumArtworkScale, isPlaying ? 1.0 : 0.7, {
    bounciness: isPlaying ? 10 : 1,
    speed: 3,
  });
  return (
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

      <View style={styles.contentContainer}>
        <View style={styles.top}>
          <NowPlayingTitle
            artist={currentTrack?.artist}
            title={currentTrack?.title}
          />
        </View>

        <NowPlayingProgress isLiveStream={!!currentTrack?.isLiveStream} />

        <NowPlayingMediaControls isLiveStream={!!currentTrack?.isLiveStream} />

        <NowPlayingVolume />
      </View>
      <View style={styles.bottom}>
        <NowPlayingBottomControls />
      </View>

      <NowPlayingBackground blurhash={currentTrack?.artworkBlur} />
    </View>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => {
  const noInset = runtime.insets.bottom === 0;
  return {
    artwork: {
      borderRadius: theme.spacing.sm,
      height: runtime.screen.width - 52,
      width: runtime.screen.width - 52,
    },
    artworkContainer: {
      alignItems: "center",
      ...theme.shadow.lg,
    },
    bottom: {
      bottom: noInset ? 50 : runtime.insets.bottom + 70,
      position: "absolute",
    },
    container: {
      height: runtime.screen.height,
      paddingTop: theme.spacing.lg,
    },
    contentContainer: {
      height: "50%",
      justifyContent: "space-between",
      paddingBottom: noInset ? 50 + 50 : runtime.insets.bottom + 70,
    },
    top: {
      paddingTop: theme.spacing.sm,
    },
  };
});
