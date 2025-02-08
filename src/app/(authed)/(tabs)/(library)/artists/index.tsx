import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useFetchArtists } from "@src/api/useFetchArtists";
import { EmptyOverlay } from "@src/components/Empty";
import { ListItem } from "@src/components/ListItem";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { NoSearchResults } from "@src/components/NoResults";
import { RightChevron } from "@src/components/RightChevron";
import { Separator } from "@src/components/Separator";
import { ThemedText } from "@src/components/ThemedText";
import { ROW_HEIGHT } from "@src/constants";
import { useAuth } from "@src/store/AuthContext";
import { useSearchStore } from "@src/store/useSearchStore";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function ArtistsList() {
  const { api } = useAuth();
  const artists = useFetchArtists(api);
  const { styles, theme } = useStyles(stylesheet);
  const { query } = useSearchStore();

  const filteredArtists = artists?.data?.Items?.filter((item) => {
    if (!query) return true;

    const searchLower = query.toLowerCase();
    return item.Name?.toLowerCase().includes(searchLower);
  });

  const renderItem = ({ item }: { item: BaseItemDto }) => {
    if (!item.Id) {
      return null;
    }

    return (
      <Link
        asChild
        href={{
          params: { id: item.Id },
          pathname: "/artists/[id]",
        }}
      >
        <ListItem
          LeftComponent={
            <View style={styles.listItemLeftContainer}>
              <Image
                contentFit="cover"
                placeholder={{
                  blurhash: extractPrimaryHash(item.ImageBlurHashes),
                }}
                source={generateArtworkUrl({ api, id: item?.Id })}
                style={styles.listItemLeftImage}
                transition={theme.timing.medium}
              />
              <ThemedText
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.listItemText}
              >
                {item.Name}
              </ThemedText>
            </View>
          }
          RightComponent={<RightChevron />}
          height={ROW_HEIGHT}
          key={item.Id}
        />
      </Link>
    );
  };

  if (artists.isPending) {
    return <LoadingOverlay />;
  }

  if (!artists.data?.Items?.length) {
    return <EmptyOverlay />;
  }

  return (
    <FlatList
      ItemSeparatorComponent={() => <Separator marginLeft={60} />}
      ListEmptyComponent={<NoSearchResults query={query} type="Artists" />}
      ListFooterComponent={ListPadding}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={filteredArtists}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      windowSize={10}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  listItemLeftContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: ROW_HEIGHT,
  },
  listItemLeftImage: {
    borderRadius: theme.spacing.xxl,
    height: theme.spacing.xxl,
    width: theme.spacing.xxl,
  },
  listItemText: {
    fontSize: 16,
    paddingLeft: theme.spacing.sm,
    paddingRight: 80,
  },
}));
