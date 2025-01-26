import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useFetchGenres } from "@src/api/useFetchGenres";
import { ListItem } from "@src/components/ListItem";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/Loading";
import { ThemedText } from "@src/components/ThemedText";
import { useAuth } from "@src/store/AuthContext";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { FlatList, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function GenresList() {
  const { api } = useAuth();
  const genres = useFetchGenres(api);
  const { styles, theme } = useStyles(stylesheet);

  const renderItem = ({ item }: { item: BaseItemDto }) => {
    if (!item.Id) {
      return null;
    }

    return (
      <Link
        asChild
        href={{
          params: { id: item.Id },
          pathname: "/genres/[id]",
        }}
      >
        <ListItem
          LeftComponent={
            <View style={styles.leftItemContainer}>
              <ThemedText style={styles.text}>{item.Name}</ThemedText>
            </View>
          }
          RightComponent={
            <View style={styles.rightItemContainer}>
              <SymbolView
                name="chevron.right"
                resizeMode="scaleAspectFit"
                size={20}
                tintColor={theme.colors.tint}
                weight="light"
              />
            </View>
          }
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
      ListFooterComponent={ListPadding}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={genres?.data?.Items}
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
  rightItemContainer: {
    justifyContent: "center",
  },
  text: { color: theme.colors.primary },
}));
