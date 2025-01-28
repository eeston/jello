import { ThemedText } from "@src/components/ThemedText";
import { TopTrackListItem } from "@src/components/TopTracksListItem";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { playTracks } from "@src/util/playTracks";
import { Dimensions, FlatList, View } from "react-native";
import TrackPlayer from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const WINDOW_WIDTH = Dimensions.get("window").width;
const ITEMS_PER_COLUMN = 4;

export const TopTracksList = ({ tracks }: { tracks?: JelloTrackItem[] }) => {
  const { styles } = useStyles(stylesheet);

  if (!tracks?.length) {
    return null;
  }

  const handleOnPressPlay = (index: number) => {
    playTracks({ skipToIndex: index, tracks });
  };

  const columns = tracks.reduce((acc, track, index) => {
    const columnIndex = Math.floor(index / ITEMS_PER_COLUMN);
    acc[columnIndex] = acc[columnIndex] || [];
    acc[columnIndex].push(track);
    return acc;
  }, [] as JelloTrackItem[][]);

  const renderColumn = ({ index: columnIndex, item: columnTracks }) => {
    return (
      <View style={styles.column}>
        {columnTracks.map((track, rowIndex) => {
          const absoluteIndex = columnIndex * ITEMS_PER_COLUMN + rowIndex;
          return (
            <TopTrackListItem
              index={absoluteIndex}
              key={track.Id}
              onPress={() => handleOnPressPlay(absoluteIndex)}
              track={track}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="subtitle">
        Top Songs
      </ThemedText>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={columns}
        horizontal
        pagingEnabled
        renderItem={renderColumn}
        showsHorizontalScrollIndicator={false}
        style={styles.flatlistContent}
      />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  column: {
    width: WINDOW_WIDTH - theme.spacing.md * 2,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  flatlistContent: {
    width: WINDOW_WIDTH,
  },
  title: {
    paddingBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
}));
