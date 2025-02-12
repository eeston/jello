import { MusicVisualizer } from "@src/components/MusicVisualiser";
import { ThemedText } from "@src/components/ThemedText";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { Image } from "expo-image";
import { View } from "react-native";
import { useActiveTrack, useIsPlaying } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const TrackListItemLeft = ({
  index,
  track,
  withArtwork,
}: {
  index: number;
  track: JelloTrackItem;
  withArtwork: boolean;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const isPlaying = useIsPlaying();
  const activeTrack = useActiveTrack();

  const isCurrentTrack = activeTrack?.id === track.id;

  if (withArtwork) {
    return (
      <View style={styles.artworkContainer}>
        <Image
          contentFit="cover"
          placeholder={{
            blurhash: track.artworkBlur,
          }}
          source={track.artwork}
          style={styles.image}
          transition={theme.timing.medium}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.indiciesContainer}>
        {isCurrentTrack ? (
          <MusicVisualizer isPlaying={!!isPlaying} />
        ) : (
          <ThemedText style={styles.text}>{index}</ThemedText>
        )}
      </View>
    );
  }
};

const stylesheet = createStyleSheet((theme) => ({
  artworkContainer: { paddingRight: theme.spacing.sm },
  image: {
    borderRadius: 5,
    height: 50,
    width: 50,
  },
  indiciesContainer: { width: 30 },
  text: { color: theme.colors.secondary, width: 30 },
}));
