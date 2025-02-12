import { ThemedText } from "@src/components/ThemedText";
import { TrackListItemLeft } from "@src/components/TrackListItem/TrackListItemLeft";
import { formatAlbumSubtext } from "@src/components/TrackListItem/formatAlbumSubtext";
import { ROW_HEIGHT } from "@src/constants";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { SymbolView } from "expo-symbols";
import { TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const TrackListItem = ({
  onPress,
  track,
  trackIndex,
  withAlbumName,
  withAlbumYear,
  withArtwork,
}: {
  onPress: () => void;
  track: JelloTrackItem;
  /**
   * @description the index of the track from within it's current context.
   * This differs from the actual track index because it will be incorrect
   * when viewing from the playlist or top track views
   */
  trackIndex: number;
  /**
   * @description should we show the album name
   */
  withAlbumName?: boolean;
  /**
   * @description should we show the album year
   */
  withAlbumYear?: boolean;
  /**
   * @description should we show the album artwork
   */
  withArtwork?: boolean;
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container(withArtwork)}>
      <TrackListItemLeft
        index={trackIndex}
        track={track}
        withArtwork={!!withArtwork}
      />
      <View style={styles.textContainer}>
        <ThemedText ellipsizeMode="tail" numberOfLines={1}>
          {track.title}
        </ThemedText>
        {withAlbumName && (
          <ThemedText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.textSub}
            type="default"
          >
            {formatAlbumSubtext({
              albumDate: track.date,
              albumName: track.album,
              withAlbumName,
              withAlbumYear,
            })}
          </ThemedText>
        )}
      </View>
      <TouchableOpacity style={styles.moreButtonContainer}>
        <SymbolView
          name="ellipsis"
          resizeMode="scaleAspectFit"
          size={14}
          tintColor={theme.colors.primary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: (large) => ({
    alignItems: "center",
    flexDirection: "row",
    height: large ? ROW_HEIGHT : 45,
  }),
  moreButtonContainer: {
    height: "100%",
    justifyContent: "center",
    paddingLeft: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  textSub: {
    color: theme.colors.secondary,
    fontSize: 12,
  },
}));
