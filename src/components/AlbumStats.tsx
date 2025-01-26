import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { ThemedText } from "@src/components/ThemedText";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { format, parseISO, secondsToMinutes } from "date-fns";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const AlbumStats = ({
  albumDetails,
  albumSongs,
}: {
  albumDetails?: BaseItemDto;
  albumSongs?: JelloTrackItem[];
}) => {
  const { styles } = useStyles(stylesheet);

  if (!albumDetails || !albumSongs?.length) {
    return null;
  }

  const totalRunTime = albumSongs?.reduce(
    (total, track) => total + (track?.duration ?? 0),
    0,
  );

  const formattedDate =
    albumDetails?.PremiereDate &&
    format(parseISO(albumDetails?.PremiereDate), "d MMMM yyyy");

  return (
    <View style={styles.container}>
      {formattedDate && (
        <ThemedText style={styles.text}>{formattedDate}</ThemedText>
      )}
      <ThemedText style={styles.text}>
        {albumSongs?.length > 1
          ? `${albumSongs?.length} songs`
          : `${albumSongs?.length} song`}
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
