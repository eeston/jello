import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useFetchAlbums } from "@src/api/useFetchAlbums";
import { AlbumCard } from "@src/components/AlbumCard";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { NoSearchResults } from "@src/components/NoResults";
import { useAuth } from "@src/store/AuthContext";
import { useSearchStore } from "@src/store/useSearchStore";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function AlbumsList() {
  const { styles } = useStyles(stylesheet);
  const { api } = useAuth();
  const albums = useFetchAlbums(api);
  const { query } = useSearchStore();

  const filteredAlbums = albums?.data?.Items?.filter((item) => {
    if (!query) return true;

    const searchLower = query.toLowerCase();
    return (
      item.Name?.toLowerCase().includes(searchLower) ||
      item.AlbumArtist?.toLowerCase().includes(searchLower)
    );
  });

  const renderItem = ({ item }: { item: BaseItemDto }) => {
    if (!item.Id) {
      return null;
    }

    return (
      <View style={styles.albumContainer}>
        <Link
          asChild
          href={{
            params: { id: item.Id },
            pathname: "/albums/[id]",
          }}
        >
          <AlbumCard
            imageHash={extractPrimaryHash(item.ImageBlurHashes)}
            imageUrl={generateArtworkUrl({ api, id: item.Id })}
            subTitle={item.AlbumArtist ?? "Unknown Artist"}
            title={item.Name ?? "Unknown Album"}
          />
        </Link>
      </View>
    );
  };

  if (albums.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <FlatList
      ListEmptyComponent={<NoSearchResults query={query} type="Albums" />}
      ListFooterComponent={ListPadding}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={filteredAlbums}
      keyExtractor={(item) => String(item.Id)}
      numColumns={2}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  albumContainer: {
    paddingBottom: theme.spacing.sm,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  container: {
    paddingBottom: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
}));
