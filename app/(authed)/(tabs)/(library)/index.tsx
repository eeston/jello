import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useFetchRecentlyAddedAlbums } from "@src/api/useFetchRecentlyAddedAlbums";
import { AlbumCard } from "@src/components/AlbumCard";
import { ListItem } from "@src/components/ListItem";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/Loading";
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
import { createStyleSheet, useStyles } from "react-native-unistyles";

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
  const { styles, theme } = useStyles(stylesheet);
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
          LeftComponent={
            <View style={styles.leftItemComponentContainer}>
              <SymbolView
                name={item.icon}
                resizeMode="scaleAspectFit"
                size={theme.symbol.md}
                tintColor={theme.colors.tint}
              />
              <ThemedText style={styles.title}>{item.title}</ThemedText>
            </View>
          }
          RightComponent={
            <View style={styles.rightItemComponentContainer}>
              <SymbolView
                name="chevron.right"
                resizeMode="scaleAspectFit"
                size={14}
                tintColor={theme.colors.secondary}
                weight="light"
              />
            </View>
          }
        />
      </Link>
    );
  };

  return (
    <FlatList
      ItemSeparatorComponent={() => <Separator marginLeft={40} />}
      ListFooterComponent={
        <RecentlyAdded recentlyAddedAlbums={recentlyAddedAlbums?.data?.Items} />
      }
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={items}
      refreshControl={
        <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
      }
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingBottom: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
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
  rightItemComponentContainer: {
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    paddingLeft: theme.spacing.md,
  },
}));

const RecentlyAdded = ({
  recentlyAddedAlbums,
}: {
  recentlyAddedAlbums?: BaseItemDto[];
}) => {
  const { styles } = useStyles(recentlyAddedStylesheet);
  const { api } = useAuth();

  const renderItem = ({ item }: { item: BaseItemDto }) => {
    if (!item.Id) {
      // appease typescript
      return;
    }
    return (
      <View style={styles.albumContainer}>
        <Link
          asChild
          href={{
            params: { id: item.Id },
            pathname: "/(authed)/(tabs)/(library)/albums/[id]",
          }}
        >
          <AlbumCard
            imageHash={extractPrimaryHash(item?.ImageBlurHashes)}
            imageUrl={generateArtworkUrl({ api, id: item.Id })}
            subTitle={item.AlbumArtist ?? "Unknown Artist"}
            title={item.Name ?? "Unknown Album"}
          />
        </Link>
      </View>
    );
  };

  if (!recentlyAddedAlbums) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="subtitle">
        Recently Added
      </ThemedText>
      <FlatList
        columnWrapperStyle={styles.columnWrapper}
        data={recentlyAddedAlbums}
        numColumns={2}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
      <ListPadding />
    </View>
  );
};

const recentlyAddedStylesheet = createStyleSheet((theme) => ({
  albumContainer: {
    paddingBottom: theme.spacing.sm,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  container: {
    //
  },
  title: {
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.lg,
  },
}));
