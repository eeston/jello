import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useFetchPlaylists } from "@src/api/useFetchPlaylists";
import { ListItem } from "@src/components/ListItem";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { NoSearchResults } from "@src/components/NoResults";
import { RightChevron } from "@src/components/RightChevron";
import { Separator } from "@src/components/Separator";
import { ThemedText } from "@src/components/ThemedText";
import { useAuth } from "@src/store/AuthContext";
import { useSearchStore } from "@src/store/useSearchStore";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { Image } from "expo-image";
import { Link, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { FlatList, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function PlaylistsList() {
  const { styles, theme } = useStyles(stylesheet);
  const { api } = useAuth();
  const playlists = useFetchPlaylists(api);
  const { query, resetQuery } = useSearchStore();

  useFocusEffect(
    useCallback(() => {
      resetQuery();
    }, []),
  );

  const filteredPlaylists = playlists?.data?.Items?.filter((item) => {
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
          pathname: "/playlists/[id]",
        }}
      >
        <ListItem
          LeftComponent={
            <View style={styles.imageContainer}>
              <Image
                contentFit="cover"
                placeholder={extractPrimaryHash(item.ImageBlurHashes)}
                source={generateArtworkUrl({ api, id: item.Id })}
                style={styles.itemImage}
                transition={theme.timing.medium}
              />
              <ThemedText>{item.Name}</ThemedText>
            </View>
          }
          RightComponent={<RightChevron />}
          height={100}
          key={item.Id}
        />
      </Link>
    );
  };

  if (playlists.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <FlatList
      ItemSeparatorComponent={() => <Separator marginLeft={100} />}
      ListEmptyComponent={<NoSearchResults query={query} type="Playlists" />}
      ListFooterComponent={ListPadding}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={filteredPlaylists}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.listStyle}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  imageContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: theme.spacing.xxl * 2,
    width: "100%",
  },
  itemImage: {
    borderRadius: theme.spacing.xs,
    height: 80,
    marginRight: theme.spacing.md,
    width: 80,
  },
  listStyle: {
    //
  },
}));
