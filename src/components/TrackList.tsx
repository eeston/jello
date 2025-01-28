import { TrackListItem } from "@src/components/TrackListItem";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { View } from "react-native";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const TrackList = ({
  isPlaylist,
  tracks,
  withArtwork,
}: {
  isPlaylist?: boolean;
  tracks?: JelloTrackItem[];
  withArtwork?: boolean;
}) => {
  const { styles } = useStyles(stylesheet);
  const currentTrack = useActiveTrack();

  if (!tracks?.length) {
    return null;
  }

  const handleOnPress = (index: number) => {
    TrackPlayer.reset();
    TrackPlayer.add(tracks);
    TrackPlayer.skip(index);
    TrackPlayer.play();
  };

  return (
    <View style={styles.container}>
      {tracks?.map((track: JelloTrackItem, index: number) => (
        <TrackListItem
          index={index}
          isCurrentTrack={currentTrack?.id === track.id}
          isPlaylist={isPlaylist}
          key={track.id}
          onPress={() => handleOnPress(index)}
          track={track}
          withArtwork={!!withArtwork}
        />
      ))}
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    //
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xxxl,
  },
}));
