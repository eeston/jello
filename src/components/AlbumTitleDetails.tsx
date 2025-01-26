import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { ThemedText } from "@src/components/ThemedText";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const AlbumTitleDetails = ({
  albumDetails,
}: {
  albumDetails?: BaseItemDto;
}) => {
  const { styles } = useStyles(stylesheet);

  if (!albumDetails) {
    return null;
  }

  const genreAndYear = `${albumDetails?.Genres?.length && albumDetails?.Genres?.at(0) + " • "}${albumDetails?.ProductionYear}`;

  return (
    <View style={styles.container}>
      <ThemedText numberOfLines={1} style={styles.text} type="subtitle">
        {albumDetails?.Name}
      </ThemedText>
      <ThemedText numberOfLines={1} style={styles.text}>
        {albumDetails?.AlbumArtist}
      </ThemedText>
      <ThemedText numberOfLines={1} style={styles.smallText} type="default">
        {genreAndYear}
      </ThemedText>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    //
  },
  smallText: {
    color: "white",
    fontSize: 12,
    lineHeight: 14,
    textAlign: "center",
  },
  text: { color: "white", lineHeight: 20, textAlign: "center" },
}));
