import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { AlbumCard } from "@src/components/AlbumCard";
import { ListPadding } from "@src/components/ListPadding";
import { useAuth } from "@src/store/AuthContext";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const AlbumColumnList = ({ albums }: { albums: BaseItemDto[] }) => {
  const { api } = useAuth();

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

  return (
    <FlatList
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={albums}
      keyExtractor={(item) => String(item.Id)}
      // ListEmptyComponent={<NoSearchResults query={query} type="Albums" />}
      ListFooterComponent={ListPadding}
      numColumns={2}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
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
