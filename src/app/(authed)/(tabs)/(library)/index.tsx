import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useFetchRecentlyAddedAlbums } from "@src/api/useFetchRecentlyAddedAlbums";
import { AlbumColumnList } from "@src/components/AlbumColumnList";
import { ListItem } from "@src/components/ListItem";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { RightChevron } from "@src/components/RightChevron";
import { Separator } from "@src/components/Separator";
import { ThemedText } from "@src/components/ThemedText";
import { useAuth } from "@src/store/AuthContext";
import { delay } from "@src/util/delay";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import { type SFSymbol, SymbolView } from "expo-symbols";
import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type ItemType = {
  icon: SFSymbol;
  screen: unknown;
  testID: string;
  title: string;
};

const items: ItemType[] = [
  {
    icon: "music.note.list",
    screen: "/(authed)/(tabs)/(library)/playlists",
    testID: "playlists-row",
    title: "Playlists",
  },
  {
    icon: "music.mic",
    screen: "/(authed)/(tabs)/(library)/artists",
    testID: "artists-row",
    title: "Artists",
  },
  {
    icon: "square.stack",
    screen: "/(authed)/(tabs)/(library)/albums",
    testID: "albums-row",
    title: "Albums",
  },
  {
    icon: "guitars",
    screen: "/(authed)/(tabs)/(library)/genres",
    testID: "genres-row",
    title: "Genres",
  },
  // TODO: songs
];

export default function LibraryDetails() {
  const { theme } = useUnistyles();
  const { api } = useAuth();
  const recentlyAddedAlbums = useFetchRecentlyAddedAlbums(api);
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries();
    await delay(theme.timing.slow);
    setIsRefreshing(false);
  };

  if (recentlyAddedAlbums.isPending) {
    return <LoadingOverlay />;
  }

  const renderItem = ({ item }: { item: (typeof items)[0] }) => {
    return (
      <Link asChild href={item.screen}>
        <ListItem
          containerStyle={styles.container}
          LeftComponent={
            <View style={styles.leftItemComponentContainer}>
              <SymbolView
                name={item.icon}
                resizeMode="scaleAspectFit"
                size={theme.symbol.md}
                tintColor={theme.colors.tint}
              />
              <ThemedText style={{ fontSize: 20, paddingLeft: 16 }}>
                {item.title}
              </ThemedText>
            </View>
          }
          RightComponent={<RightChevron />}
        />
      </Link>
    );
  };

  return (
    <FlatList
      // contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={items}
      ItemSeparatorComponent={() => <Separator marginLeft={40} />}
      ListFooterComponent={
        <View>
          <Separator marginLeft={40} />
          <RecentlyAdded
            recentlyAddedAlbums={recentlyAddedAlbums?.data?.Items}
          />
        </View>
      }
      refreshControl={
        <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
      }
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.md,
  },
  leftItemComponentContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  renderItemContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
}));

const RecentlyAdded = ({
  recentlyAddedAlbums,
}: {
  recentlyAddedAlbums?: BaseItemDto[];
}) => {
  if (!recentlyAddedAlbums) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="subtitle">
        Recently Added
      </ThemedText>
      <AlbumColumnList albums={recentlyAddedAlbums} />
    </View>
  );
};
