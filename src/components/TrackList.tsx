import { Separator } from "@src/components/Separator";
import { TrackListItem } from "@src/components/TrackListItem";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { playTracks } from "@src/util/playTracks";
import { View } from "react-native";
import { useActiveTrack } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const TrackList = ({
  isPlaylist,
  tracks,
}: {
  isPlaylist?: boolean;
  tracks?: JelloTrackItem[];
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const currentTrack = useActiveTrack();

  if (!tracks?.length) {
    return null;
  }

  const handleOnPress = (index: number) => {
    playTracks({ skipToIndex: index, tracks });
  };

  return (
    <View style={styles.container}>
      {tracks?.map((track: JelloTrackItem, index: number) => (
        <View key={track.id}>
          <TrackListItem
            index={index}
            isCurrentTrack={currentTrack?.id === track.id}
            isPlaylist={isPlaylist}
            key={track.id}
            onPress={() => handleOnPress(index)}
            track={track}
          />
          <Separator
            marginLeft={index === tracks.length - 1 ? 0 : theme.spacing.xl}
          />
        </View>
      ))}
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    //
  },
}));
