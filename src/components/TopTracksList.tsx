import { ThemedText } from "@src/components/ThemedText";
import { TopTrackListItem } from "@src/components/TopTracksListItem";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { playTracks } from "@src/util/playTracks";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const WINDOW_WIDTH = Dimensions.get("window").width;
const ITEMS_PER_COLUMN = 4;

export const TopTracksList = ({
  artistId,
  tracks,
}: {
  artistId: string;
  tracks?: JelloTrackItem[];
}) => {
  const { styles, theme } = useStyles(stylesheet);

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
      <View key={columnIndex} style={styles.column}>
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
      <Link
        asChild
        href={{ params: { id: artistId }, pathname: "/artists/[id]/top-songs" }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingBottom: theme.spacing.xs,
            paddingTop: theme.spacing.lg,
          }}
        >
          <ThemedText style={styles.title} type="subtitle">
            Top Songs
          </ThemedText>
          <SymbolView
            name="chevron.right"
            resizeMode="scaleAspectFit"
            size={14}
            tintColor={theme.colors.secondary}
            weight="heavy"
          />
        </TouchableOpacity>
      </Link>
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
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.xxs,
  },
}));
