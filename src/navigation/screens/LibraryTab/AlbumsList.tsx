import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DebouncedFunc } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  NativeSyntheticEvent,
  SafeAreaView,
  TextInputFocusEventData,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchAlbums } from "../../../api/albums";
import { AlbumCard } from "../../../components/AlbumCard";
import { LoadingOverlay } from "../../../components/Loading";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { useSearchBar } from "../../../hooks/useSearchBar";
import { useApi } from "../../../store/useJelloAuth";
import { extractPrimaryHash } from "../../../util/extractPrimaryHash";
import { filterItems } from "../../../util/filterItems";
import { generateTrackArtworkUrl } from "../../../util/generateTrackArtworkUrl";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type Props = NativeStackScreenProps<LibraryTabParamList, "AlbumsList">;

export const AlbumsListScreen = ({ navigation }: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const albums = useFetchAlbums(api);
  const headerHeight = useHeaderHeight();
  const [filteredItemsList, setFilteredItemsList] = useState<BaseItemDto[]>([]);
  const debouncedFilterItems = useRef<null | DebouncedFunc<
    (textInput: string) => void
  >>(null);

  if (albums?.data?.Items ?? [].length > 0) {
    debouncedFilterItems.current = filterItems({
      items: albums?.data?.Items,
      setFilteredItemsList,
    });
  }

  const onChangeText = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    debouncedFilterItems.current?.cancel();
    debouncedFilterItems.current?.(e.nativeEvent.text);
  };

  useSearchBar({ navigation, onChangeText, placeholder: "Find in Albums" });

  useEffect(() => {
    setFilteredItemsList(albums.data?.Items);
  }, [albums.data?.Items]);

  const opacity = useFadeIn([albums]);

  const onPressAlbumItem = useCallback(
    (albumId: string) => {
      return navigation.navigate("AlbumDetails", { albumId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: BaseItemDto }) => (
      <AlbumCard
        title={item.Name ?? "Unknown Album"}
        subTitle={item.AlbumArtist ?? "Unknown Artist"}
        imageUrl={generateTrackArtworkUrl({ id: item.Id, api })}
        imageHash={extractPrimaryHash(item.ImageBlurHashes)}
        onPress={() => onPressAlbumItem(item.Id)}
      />
    ),
    [api, onPressAlbumItem],
  );

  if (albums.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={[styles.container, { marginTop: -headerHeight }]}>
      <Animated.FlatList
        style={{ paddingTop: headerHeight + theme.spacing.sm, opacity }}
        // ListHeaderComponent={<AlbumsHeader />} TODO: hmmmm...
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={filteredItemsList}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.Id}
        ListFooterComponent={<View style={{ height: headerHeight + 200 }} />}
      />
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
}));
