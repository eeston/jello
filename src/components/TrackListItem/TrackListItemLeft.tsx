import { ThemedText } from "@src/components/ThemedText";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import LoaderKit from "react-native-loader-kit";
import { useActiveTrack } from "react-native-track-player";
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
      <View style={styles.container}>
        {isCurrentTrack ? (
          <View>
            {/* TODO: add favourite */}
            <LoaderKit
              color="red"
              name="LineScaleParty"
              style={{
                height: 16,
                width: 16,
              }}
            />
          </View>
        ) : (
          <View style={styles.indiciesContainer}>
            {track.isFavourite && (
              <SymbolView
                name="star.fill"
                resizeMode="scaleAspectFit"
                size={8}
                style={styles.favouriteStar}
                tintColor={theme.colors.tint}
              />
            )}
            <ThemedText style={styles.text}>{index}</ThemedText>
          </View>
        )}
      </View>
    );
  }
};

const stylesheet = createStyleSheet((theme) => ({
  artworkContainer: { paddingRight: theme.spacing.sm },
  container: { width: 30 },
  favouriteStar: { left: -theme.spacing.xxs, position: "absolute" },
  image: {
    borderRadius: 5,
    height: 50,
    width: 50,
  },
  indiciesContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.secondary,
    paddingLeft: theme.spacing.xs,
    width: 30,
  },
}));
