import { ListItem } from "@src/components/ListItem";
import { MusicVisualizer } from "@src/components/MusicVisualiser";
import { ThemedText } from "@src/components/ThemedText";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { View } from "react-native";
import { useIsPlaying } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const TrackListItem = ({
  index,
  isCurrentTrack,
  isPlaylist,
  onPress,
  track,
}: {
  index: number;
  isCurrentTrack: boolean;
  isPlaylist?: boolean;
  onPress: () => void;
  track: JelloTrackItem;
}) => {
  const { styles } = useStyles(stylesheet);
  const { playing: isPlaying } = useIsPlaying();

  return (
    <ListItem
      LeftComponent={
        <View style={styles.leftContainer}>
          <View style={styles.indices}>
            {isCurrentTrack ? (
              <MusicVisualizer isPlaying={!!isPlaying} />
            ) : (
              <ThemedText style={styles.indices}>
                {isPlaylist ? index + 1 : track.index}
              </ThemedText>
            )}
          </View>
          <ThemedText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.title}
          >
            {track.title}
          </ThemedText>
        </View>
      }
      key={track.id}
      onPress={onPress}
    />
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {},
  indices: {
    color: "grey",
    width: 30,
  },
  leftContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    maxWidth: "90%",
  },
}));
