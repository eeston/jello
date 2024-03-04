import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DebouncedFunc } from "lodash";
import { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  NativeSyntheticEvent,
  SafeAreaView,
  TextInputFocusEventData,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchGenres } from "../../../api/genres";
import { ListItem } from "../../../components/ListItem";
import { LoadingOverlay } from "../../../components/Loading";
import { Separator } from "../../../components/Separator";
import { Text } from "../../../components/Themed";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { useSearchBar } from "../../../hooks/useSearchBar";
import { useApi } from "../../../store/useJelloAuth";
import { filterItems } from "../../../util/filterItems";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type Props = NativeStackScreenProps<LibraryTabParamList, "GenresList">;

export const GenresListScreen = ({ navigation }: Props) => {
  const api = useApi((state) => state.api);
  const genres = useFetchGenres(api);
  const headerHeight = useHeaderHeight();
  const { styles, theme } = useStyles(stylesheet);
  const [filteredItemsList, setFilteredItemsList] = useState<BaseItemDto[]>([]);
  const debouncedFilterItems = useRef<null | DebouncedFunc<
    (textInput: string) => void
  >>(null);

  if (genres?.data?.Items ?? [].length > 0) {
    debouncedFilterItems.current = filterItems({
      items: genres?.data?.Items,
      setFilteredItemsList,
    });
  }

  const onChangeText = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    debouncedFilterItems.current?.cancel();
    debouncedFilterItems.current?.(e.nativeEvent.text);
  };

  useSearchBar({ navigation, onChangeText, placeholder: "Find in Genres" });

  useEffect(() => {
    setFilteredItemsList(genres?.data?.Items);
  }, [genres?.data?.Items]);

  const opacity = useFadeIn([genres]);

  const onPressGenreItem = (genreId: string, genreName: string) => {
    return navigation.navigate("GenreDetails", { genreId, genreName });
  };

  const SeparatorComponent = memo(() => <Separator marginLeft={0} />);

  const renderItem = ({ item }: { item: BaseItemDto }) => (
    <ListItem
      containerStyle={{}}
      key={item.Id}
      LeftComponent={
        <View style={styles.textContainer}>
          <Text style={{ fontSize: 16, color: theme.colors.primary }}>
            {item.Name}
          </Text>
        </View>
      }
      onPress={() => onPressGenreItem(item.Id, item.Name)}
    />
  );

  if (genres.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={[styles.container, { marginTop: -headerHeight }]}>
      <Animated.FlatList
        style={[
          styles.listStyle,
          { paddingTop: headerHeight + theme.spacing.sm, opacity },
        ]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={filteredItemsList}
        renderItem={renderItem}
        ItemSeparatorComponent={SeparatorComponent}
        ListFooterComponent={<View style={{ height: headerHeight + 200 }} />}
      />
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  listStyle: {
    paddingHorizontal: theme.spacing.md,
  },
  textContainer: {
    flexDirection: "row",
    // height: theme.spacing.xxl * 2,
    width: "100%",
    alignItems: "center",
  },
}));
