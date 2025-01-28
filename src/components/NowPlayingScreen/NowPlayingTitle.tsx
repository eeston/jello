import { ThemedText } from "@src/components/ThemedText";
import { View } from "react-native";
import { TrackMetadataBase } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingTitle = ({
  artist,
  title,
}: {
  artist: TrackMetadataBase["artist"];
  title: TrackMetadataBase["title"];
}) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View>
        <ThemedText
          numberOfLines={1}
          style={{ color: "white" }}
          type="subtitle"
        >
          {title ?? "Unknown Track"}
        </ThemedText>
        <ThemedText
          style={{ color: "rgba(255, 255, 255, 0.4)" }}
          type="defaultSemiBold"
        >
          {artist ?? "Unknown Artist"}
        </ThemedText>
      </View>
      {/* TODO: add right action button */}
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    paddingHorizontal: theme.spacing.xl,
    width: "100%",
  },
}));
