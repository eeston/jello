import { Separator } from "@src/components/Separator";
import { ThemedText } from "@src/components/ThemedText";
import { TrackListItem } from "@src/components/TrackListItem";
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { playTracks } from "@src/util/playTracks";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const WINDOW_WIDTH = Dimensions.get("window").width;
const ITEMS_PER_COLUMN = 4;
const COLUMN_WIDTH = WINDOW_WIDTH - 60;

export const TopTracksColumns = ({
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

  const columns = tracks.reduce<JelloTrackItem[][]>((acc, track, index) => {
    const columnIndex = Math.floor(index / ITEMS_PER_COLUMN);
    acc[columnIndex] = acc[columnIndex] || [];
    acc[columnIndex].push(track);
    return acc;
  }, []);

  const renderColumn = ({
    index,
    item,
  }: ListRenderItemInfo<JelloTrackItem[]>) => {
    const isLastColumn = index === columns.length - 1;
    return (
      <View
        key={index}
        style={[styles.column, isLastColumn && styles.lastColumn]}
      >
        {item.map((track, rowIndex) => {
          const absoluteIndex = index * ITEMS_PER_COLUMN + rowIndex;
          return (
            <View key={track.id}>
              <TrackListItem
                index={index}
                key={track.id}
                onPress={() => handleOnPressPlay(absoluteIndex)}
                track={track}
                withAlbumName
                withAlbumYear
                withArtwork
              />
              {rowIndex < item.length - 1 && <Separator marginLeft={62} />}
            </View>
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
        decelerationRate="fast"
        horizontal
        pagingEnabled
        renderItem={renderColumn}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={COLUMN_WIDTH}
        style={styles.flatlistContent}
      />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  column: {
    paddingRight: theme.spacing.md,
    width: COLUMN_WIDTH,
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
  lastColumn: {
    paddingRight: 0,
    width: WINDOW_WIDTH - theme.spacing.md * 2,
  },
  title: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.xxs,
  },
}));
