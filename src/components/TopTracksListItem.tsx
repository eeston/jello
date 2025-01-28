import { ListItem } from "@src/components/ListItem";
import { ThemedText } from "@src/components/ThemedText";
import { ROW_HEIGHT } from "@src/constants";
import { fmtIsoYear } from "@src/util/date";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { Image } from "expo-image";
import { View } from "react-native";
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
    <ListItem
      LeftComponent={
        <View style={styles.leftContainer}>
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
            <View style={styles.subTextContainer}>
              <ThemedText
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.textSub}
                type="defaultSemiBold"
              >
                {track.album}
              </ThemedText>
              <ThemedText
                style={[styles.textSub, styles.yearText]}
                type="defaultSemiBold"
              >
                {" • " + fmtIsoYear(track.date)}
              </ThemedText>
            </View>
          </View>
        </View>
      }
      height={ROW_HEIGHT}
      key={track.id}
      onPress={onPress}
    />
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {},
  image: {
    borderRadius: 5,
    height: 50,
    width: 50,
  },
  leftContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  subTextContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  textContainer: {
    marginHorizontal: theme.spacing.md,
    width: "75%",
  },
  textSub: {
    color: theme.colors.secondary,
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 14,
  },
  yearText: {
    flexShrink: 0,
  },
}));
