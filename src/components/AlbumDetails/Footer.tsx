import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, StackActions } from "@react-navigation/native";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { View, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles, createStyleSheet } from "react-native-unistyles";

import { useFetchMoreArtistAlbums } from "../../api/albums";
import { useApi } from "../../store/useJelloAuth";
import { extractPrimaryHash } from "../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../util/generateTrackArtworkUrl";
import { ticksToMins } from "../../util/time";
import { AlbumCard } from "../AlbumCard";
import { Separator } from "../Separator";
import { Text } from "../Themed";

type AlbumFooterProps = {
  albumDetails?: BaseItemDto;
  albumSongs?: BaseItemDto[];
};

export const AlbumFooter = ({ albumDetails, albumSongs }: AlbumFooterProps) => {
  const { styles } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const moreAlbums = useFetchMoreArtistAlbums(
    api,
    albumDetails?.ParentId,
    albumDetails?.Id,
  );
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const totalRunTime = useMemo(() => {
    return albumSongs?.reduce((total, song) => total + song.RunTimeTicks, 0);
  }, [albumSongs]);

  const AlbumStats = () => {
    return (
      <View style={styles.albumStatsContainer}>
        <Text style={styles.albumStats}>
          {albumDetails?.PremiereDate &&
            format(parseISO(albumDetails?.PremiereDate), "d MMMM yyyy")}
        </Text>
        <Text style={styles.albumStats}>
          {albumSongs?.length > 1
            ? `${albumSongs?.length} songs`
            : `${albumSongs?.length} song`}
          {", "}
          {ticksToMins(totalRunTime)} minutes
        </Text>
      </View>
    );
  };

  if (!moreAlbums.data?.Items?.length) {
    return (
      <View
        style={[
          styles.footerContainer,
          { paddingBottom: bottom + headerHeight + 150 },
        ]}
      >
        <Separator marginLeft={20} />
        <AlbumStats />
      </View>
    );
  }

  const onPressAlbumItem = (albumId: string) => {
    navigation.dispatch(StackActions.replace("AlbumDetails", { albumId }));
  };

  const renderItem = ({ item }: { item: BaseItemDto }) => (
    <AlbumCard
      title={item?.Name ?? "Unknown Album"}
      subTitle={item?.ProductionYear ?? "Unknown Year"}
      imageUrl={generateTrackArtworkUrl({ id: item.Id, api })}
      imageHash={extractPrimaryHash(item?.ImageBlurHashes)}
      onPress={() => onPressAlbumItem(item?.Id)}
    />
  );

  return (
    <View style={styles.footerContainer}>
      <Separator marginLeft={20} />
      <AlbumStats />
      <View
        style={[
          styles.moreContainer,
          { paddingBottom: bottom + headerHeight + 150 },
        ]}
      >
        <Text
          style={styles.title}
        >{`More By ${albumDetails?.AlbumArtist}...`}</Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={moreAlbums.data?.Items}
          renderItem={renderItem}
          horizontal
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.flatlistContent}
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  footerContainer: {
    flex: 1,
  },
  albumStatsContainer: {
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  albumStats: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  moreContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
  },
  title: {
    fontSize: 20,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    fontWeight: "bold",
  },
  flatlistContent: {
    paddingHorizontal: theme.spacing.md,
  },
  separator: {
    width: theme.spacing.sm,
  },
}));
