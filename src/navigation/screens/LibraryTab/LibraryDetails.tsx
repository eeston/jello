import {
  BaseItemDto,
  BaseItemDtoQueryResult,
} from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UseQueryResult } from "@tanstack/react-query";
import { memo } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  SafeAreaView,
  View,
} from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchRecentlyAddedAlbums } from "../../../api/albums";
import { AlbumCard } from "../../../components/AlbumCard";
import { ListItem } from "../../../components/ListItem";
import { Separator } from "../../../components/Separator";
import { Text } from "../../../components/Themed";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { useQueryFocus } from "../../../hooks/useQueryFocus";
import { useApi } from "../../../store/useJelloAuth";
import { extractPrimaryHash } from "../../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../../util/generateTrackArtworkUrl";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type ItemType = {
  title: string;
  icon: string;
  screen: "PlaylistsList" | "ArtistsList" | "AlbumsList" | "GenresList";
  testID: string;
};

const items: ItemType[] = [
  {
    title: "Playlists",
    icon: "music.note.list",
    screen: "PlaylistsList",
    testID: "playlists-row",
  },
  {
    title: "Artists",
    icon: "music.mic",
    screen: "ArtistsList",
    testID: "artists-row",
  },
  {
    title: "Albums",
    icon: "square.stack",
    screen: "AlbumsList",
    testID: "albums-row",
  },
  {
    title: "Genres",
    icon: "guitars",
    screen: "GenresList",
    testID: "genres-row",
  },
];
type Props = NativeStackScreenProps<LibraryTabParamList, "LibraryDetails">;

export const LibraryDetailsScreen = ({ route, navigation }: Props) => {
  useQueryFocus();
  const { styles, theme } = useStyles(stylesheet);
  const headerHeight = useHeaderHeight();
  const api = useApi((state) => state.api);
  const recentlyAddedAlbums = useFetchRecentlyAddedAlbums(api);

  const opacity = useFadeIn([recentlyAddedAlbums]);

  const onPressLibraryItem = (screen: ItemType["screen"]) => {
    return navigation.navigate(screen);
  };

  const renderItem = ({ item }: { item: (typeof items)[0] }) => {
    return (
      <View style={styles.renderItemWrapper} testID={item.testID}>
        <SFSymbol
          name={item.icon}
          color={theme.colors.primary}
          size={24}
          resizeMode="center"
          style={{ width: 50 }}
        />
        <ListItem
          containerStyle={{ flex: 1 }}
          onPress={() => onPressLibraryItem(item.screen)}
          LeftComponent={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.listItem}>{item.title}</Text>
            </View>
          }
          RightComponent={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SFSymbol
                name="chevron.right"
                weight="semibold"
                color={theme.colors.text}
                size={14}
                resizeMode="center"
                style={{ width: 14 }}
              />
            </View>
          }
        />
      </View>
    );
  };

  const SeparatorComponent = memo(() => <Separator marginLeft={50} />);

  return (
    <SafeAreaView style={[styles.container, { marginTop: -headerHeight }]}>
      <Animated.FlatList
        style={{ paddingTop: headerHeight + theme.spacing.sm, opacity }}
        data={items}
        renderItem={renderItem}
        ListFooterComponent={
          <RecentlyAdded recentlyAddedAlbums={recentlyAddedAlbums} />
        }
        ItemSeparatorComponent={SeparatorComponent}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {},
  listItem: {
    fontSize: 20,
    fontWeight: "400",
  },
  recentlyAdded: {
    fontSize: 20,
    fontWeight: "bold",
  },
  renderItemWrapper: {
    paddingHorizontal: theme.spacing.xs,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const RecentlyAdded = ({
  recentlyAddedAlbums,
}: {
  recentlyAddedAlbums: UseQueryResult<BaseItemDtoQueryResult, Error>;
}) => {
  const { styles } = useStyles(recentlyAddedStylesheet);
  const api = useApi((state) => state.api);

  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  const onPressAlbum = (albumId: string) => {
    return navigation.navigate("AlbumDetails", { albumId });
  };

  const renderItem = ({ item }: { item: BaseItemDto }) => (
    <AlbumCard
      title={item.Name ?? "Unknown Album"}
      subTitle={item.AlbumArtist ?? "Unknown Artist"}
      imageUrl={generateTrackArtworkUrl({ id: item.Id, api })}
      imageHash={extractPrimaryHash(item?.ImageBlurHashes)}
      onPress={() => onPressAlbum(item.Id)}
    />
  );

  return (
    <View style={styles.container}>
      <Separator marginLeft={50} />
      <Text style={styles.title}>Recently Added</Text>
      {recentlyAddedAlbums.isPending ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-around",
            height: 200,
          }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          style={{ paddingBottom: headerHeight }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={recentlyAddedAlbums.data?.Items}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
};

const recentlyAddedStylesheet = createStyleSheet((theme) => ({
  container: {
    paddingBottom: 160,
  },
  title: {
    fontSize: 22,
    padding: theme.spacing.md,
    fontWeight: "bold",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
}));
