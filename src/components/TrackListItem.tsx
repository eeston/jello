import { MusicVisualizer } from "@src/components/MusicVisualiser";
import { ThemedText } from "@src/components/ThemedText";
import { ROW_HEIGHT } from "@src/constants";
import { fmtIsoYear } from "@src/util/date";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { TouchableOpacity, View } from "react-native";
import { useIsPlaying } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const TrackListItem = ({
  index,
  isCurrentTrack,
  isPlaylist,
  onPress,
  track,
  withAlbumName,
  withAlbumYear,
  withArtwork,
}: {
  index: number;
  isCurrentTrack: boolean;
  isPlaylist?: boolean;
  onPress: () => void;
  track: JelloTrackItem;
  withAlbumName?: boolean;
  withAlbumYear?: boolean;
  withArtwork?: boolean;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const { playing: isPlaying } = useIsPlaying();

  const TrackListLeftItem = ({ withArtwork = false }) => {
    if (withArtwork) {
      return (
        <View style={{ paddingRight: theme.spacing.sm }}>
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
        <View style={{ width: 30 }}>
          {isCurrentTrack ? (
            <MusicVisualizer isPlaying={!!isPlaying} />
          ) : (
            <ThemedText style={{ color: theme.colors.secondary, width: 30 }}>
              {isPlaylist ? index + 1 : track.index}
            </ThemedText>
          )}
        </View>
      );
    }
  };

  const formatAlbumInfo = ({
    albumDate,
    albumName,
    withAlbumName,
    withAlbumYear,
  }: {
    albumDate: string;
    albumName: string;
    withAlbumName?: boolean;
    withAlbumYear?: boolean;
  }) => {
    if (!withAlbumName) return "";
    if (!albumName) return "";
    if (withAlbumYear && albumDate) {
      return `${albumName} • ${fmtIsoYear(albumDate)}`;
    }
    return albumName;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container(withArtwork)}>
      <TrackListLeftItem withArtwork={withArtwork} />
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
            {formatAlbumInfo({
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
  },
  textSub: {
    color: theme.colors.secondary,
    fontSize: 12,
  },
}));
