import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useFetchGenreAlbums } from "@src/api/useFetchGenreAlbums";
import { AlbumCard } from "@src/components/AlbumCard";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { NoSearchResults } from "@src/components/NoResults";
import { useAuth } from "@src/store/AuthContext";
import { useSearchGenreAlbumsStore } from "@src/store/useSearchStore";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { FlatList, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function GenreDetails() {
  // if no id...
  const { id: genreId, name: genreName } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();
  const { styles } = useStyles(stylesheet);
  const navigation = useNavigation();
  const { api } = useAuth();
  const genreAlbums = useFetchGenreAlbums(api, genreId);
  const { query } = useSearchGenreAlbumsStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: genreName,
    });
  }, [genreName]);

  const filteredAlbums = genreAlbums?.data?.Items?.filter((item) => {
    if (!query) return true;

    const searchLower = query.toLowerCase();
    return item.Name?.toLowerCase().includes(searchLower);
  });

  const renderItem = ({ item }: { item: BaseItemDto }) => {
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

  if (genreAlbums.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <FlatList
      ListEmptyComponent={<NoSearchResults query={query} type="Genres" />}
      ListFooterComponent={<ListPadding />}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={filteredAlbums}
      keyExtractor={(item) => item?.Id ?? ""}
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
