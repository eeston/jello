import { ThemedText } from "@src/components/ThemedText";
import { secondsToMmSs } from "@src/util/time";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { useProgress } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingProgress = ({
  duration,
  isLiveStream,
}: {
  duration: number;
  isLiveStream: boolean;
}) => {
  const { styles } = useStyles(stylesheet);
  const { position } = useProgress();

  const progress = duration > 0 ? (position / duration) * 100 : 0;

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
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>

      <View style={styles.timeContainer}>
        <ThemedText style={styles.timeText}>
          {secondsToMmSs(position)}
        </ThemedText>
        <ThemedText style={styles.timeText}>
          -{secondsToMmSs(Math.max(0, duration - position))}
        </ThemedText>
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
    borderRadius: 5,
    height: 6,
    width: "100%",
  },
  liveText: {
    color: "white",
    fontSize: 14,
    marginTop: -16,
  },
  progress: {
    backgroundColor: "#ffffff6a",
    borderBottomRightRadius: 0,
    borderRadius: 5,
    borderTopRightRadius: 0,
    height: "100%",
    width: "30%",
  },
  progressBar: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    height: 6,
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
}));
