import { ThemedText } from "@src/components/ThemedText";
import { ROW_HEIGHT } from "@src/constants";
import { fmtIsoYear } from "@src/util/date";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const TopTrackListItem = ({
  onPress,
  track,
}: {
  onPress: () => void;
  track: JelloTrackItem;
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        contentFit="cover"
        placeholder={{
          blurhash: track.artworkBlur,
        }}
        source={track.artwork}
        style={styles.image}
        transition={theme.timing.medium}
      />
      <View style={styles.textContainer}>
        <ThemedText ellipsizeMode="tail" numberOfLines={1}>
          {track.title}
        </ThemedText>
        <ThemedText
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.textSub}
          type="default"
        >
          {track.album} {" • " + fmtIsoYear(track.date)}
        </ThemedText>
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
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: ROW_HEIGHT,
  },
  image: {
    borderRadius: 5,
    height: 50,
    width: 50,
  },
  moreButtonContainer: {
    height: "100%",
    justifyContent: "center",
    paddingLeft: theme.spacing.sm,
  },
  subTextContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  textSub: {
    color: theme.colors.secondary,
    fontSize: 12,
  },
}));
