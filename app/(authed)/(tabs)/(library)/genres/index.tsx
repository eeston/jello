import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useFetchGenres } from "@src/api/useFetchGenres";
import { ListItem } from "@src/components/ListItem";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/Loading";
import { RightChevron } from "@src/components/RightChevron";
import { Separator } from "@src/components/Separator";
import { ThemedText } from "@src/components/ThemedText";
import { useAuth } from "@src/store/AuthContext";
import { useSearchStore } from "@src/store/useSearchStore";
import { Link, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { FlatList, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function GenresList() {
  const { api } = useAuth();
  const genres = useFetchGenres(api);
  const { styles } = useStyles(stylesheet);
  const { query, resetQuery } = useSearchStore();

  useFocusEffect(
    useCallback(() => {
      resetQuery();
    }, []),
  );

  const filteredGenres = genres?.data?.Items?.filter((item) => {
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
          params: { id: item.Id, name: item.Name },
          pathname: "/genres/[id]",
        }}
      >
        <ListItem
          LeftComponent={
            <View style={styles.leftItemContainer}>
              <ThemedText style={styles.text}>{item.Name}</ThemedText>
            </View>
          }
          RightComponent={<RightChevron />}
          key={item.Id}
        />
      </Link>
    );
  };

  if (genres.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <FlatList
      ItemSeparatorComponent={() => <Separator />}
      ListFooterComponent={ListPadding}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={filteredGenres}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  leftItemContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  text: { color: theme.colors.tint },
}));
