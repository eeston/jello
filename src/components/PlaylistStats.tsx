import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { ThemedText } from "@src/components/ThemedText";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { format, parseISO, secondsToMinutes } from "date-fns";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const PlaylistStats = ({
  playlistDetails,
  playlistSongs,
}: {
  playlistDetails?: BaseItemDto;
  playlistSongs?: JelloTrackItem[];
}) => {
  const { styles } = useStyles(stylesheet);

  if (!playlistSongs?.length) {
    return null;
  }

  const totalRunTime = playlistSongs?.reduce(
    (total, song) => total + (song?.duration ?? 0),
    0,
  );

  const formattedDate =
    playlistDetails?.PremiereDate &&
    format(parseISO(playlistDetails?.PremiereDate), "d MMMM yyyy");

  return (
    <View style={styles.container}>
      {formattedDate && (
        <ThemedText style={styles.text}>{formattedDate}</ThemedText>
      )}
      <ThemedText style={styles.text}>
        {playlistSongs?.length > 1
          ? `${playlistSongs?.length} songs`
          : `${playlistSongs?.length} song`}
        {", "}
        {secondsToMinutes(totalRunTime)} minutes
      </ThemedText>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingVertical: theme.spacing.xs,
  },
  text: {
    color: theme.colors.secondary,
    fontSize: 14,
    lineHeight: 16,
  },
}));
