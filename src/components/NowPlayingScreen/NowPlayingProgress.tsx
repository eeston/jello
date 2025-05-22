import { ThemedText } from "@src/components/ThemedText";
import { secondsToMmSs } from "@src/util/time";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingProgress = ({
  isLiveStream,
}: {
  isLiveStream: boolean;
}) => {
  const { styles } = useStyles(stylesheet);
  const { duration, position } = useProgress();

  const isSliding = useSharedValue(false);
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const trackPosition = secondsToMmSs(position);
  const trackRemaining = secondsToMmSs(Math.max(0, duration - position));

  if (!isSliding.value) {
    progress.value = duration > 0 ? position / duration : 0;
  }

  if (isLiveStream) {
    return (
      <View style={styles.liveContainer}>
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0.3)",
            "rgba(255, 255, 255, 0.1)",
            "transparent",
            "rgba(255, 255, 255, 0.1)",
            "rgba(255, 255, 255, 0.3)",
          ]}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.3, 0.5, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          style={styles.liveProgressBar}
        />
        <ThemedText
          numberOfLines={1}
          style={styles.liveText}
          type="defaultSemiBold"
        >
          LIVE
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Slider
        containerStyle={styles.sliderContainer}
        maximumValue={max}
        minimumValue={min}
        onSlidingComplete={async (value) => {
          if (!isSliding.value) return;

          isSliding.value = false;

          await TrackPlayer.seekTo(value * duration);
        }}
        onSlidingStart={() => (isSliding.value = true)}
        onValueChange={async (value) => {
          await TrackPlayer.seekTo(value * duration);
        }}
        progress={progress}
        renderBubble={() => null}
        theme={{
          maximumTrackTintColor: "rgba(255, 255, 255, 0.3)",
          minimumTrackTintColor: "rgba(255, 255, 255, 0.5)",
        }}
        thumbWidth={0}
      />
      <View style={styles.timeContainer}>
        <ThemedText style={styles.timeText}>{trackPosition}</ThemedText>

        <ThemedText style={styles.timeText}>- {trackRemaining}</ThemedText>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.xl,
    width: "100%",
  },
  liveContainer: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    width: "100%",
  },
  liveProgressBar: {
    borderRadius: 6,
    height: 6,
    width: "100%",
  },
  liveText: {
    color: "white",
    fontSize: 14,
    marginTop: -theme.spacing.md,
  },
  sliderContainer: {
    borderRadius: 6,
    height: 6,
  },
  timeContainer: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.xs,
  },
  timeText: {
    color: "white",
    fontSize: 12,
    opacity: 0.6,
  },
}));
