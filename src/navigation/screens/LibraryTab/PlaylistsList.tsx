import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { DebouncedFunc } from "lodash";
import { useState, useEffect, useRef } from "react";
import {
  Animated,
  NativeSyntheticEvent,
  SafeAreaView,
  TextInputFocusEventData,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchPlaylists } from "../../../api/playlists";
import { ListItem } from "../../../components/ListItem";
import { LoadingOverlay } from "../../../components/Loading";
import { Text } from "../../../components/Themed";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { useSearchBar } from "../../../hooks/useSearchBar";
import { useApi } from "../../../store/useJelloAuth";
import { extractPrimaryHash } from "../../../util/extractPrimaryHash";
import { filterItems } from "../../../util/filterItems";
import { generateTrackArtworkUrl } from "../../../util/generateTrackArtworkUrl";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type Props = NativeStackScreenProps<LibraryTabParamList, "PlaylistsList">;

export const PlaylistsListScreen = ({ navigation }: Props) => {
  const api = useApi((state) => state.api);
  const playlists = useFetchPlaylists(api);
  const headerHeight = useHeaderHeight();
  const { styles, theme } = useStyles(stylesheet);
  const [filteredItemsList, setFilteredItemsList] = useState<BaseItemDto[]>([]);
  const debouncedFilterItems = useRef<null | DebouncedFunc<
    (textInput: string) => void
  >>(null);

  if (playlists?.data?.Items ?? [].length > 0) {
    debouncedFilterItems.current = filterItems({
      items: playlists?.data?.Items,
      setFilteredItemsList,
    });
  }

  const onChangeText = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    debouncedFilterItems.current?.cancel();
    debouncedFilterItems.current?.(e.nativeEvent.text);
  };

  useSearchBar({ navigation, onChangeText, placeholder: "Find in Playlists" });

  useEffect(() => {
    setFilteredItemsList(playlists?.data?.Items);
  }, [playlists?.data?.Items]);

  const opacity = useFadeIn([playlists]);

  const onPressPlaylistItem = (playlistId: string) => {
    return navigation.navigate("PlaylistDetails", { playlistId });
  };

  const renderItem = ({ item }: { item: BaseItemDto }) => (
    <ListItem
      containerStyle={{ height: theme.spacing.xxl * 2 }}
      key={item.Id}
      LeftComponent={
        <View style={styles.imageContainer}>
          <Image
            style={styles.itemImage}
            source={generateTrackArtworkUrl({ id: item.Id, api })}
            placeholder={extractPrimaryHash(item.ImageBlurHashes)}
            contentFit="cover"
            transition={300}
          />
          <Text style={{ fontSize: 16 }}>{item.Name}</Text>
        </View>
      }
      onPress={() => onPressPlaylistItem(item.Id)}
    />
  );

  if (playlists.isPending) {
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
  imageContainer: {
    flexDirection: "row",
    height: theme.spacing.xxl * 2,
    width: "100%",
    alignItems: "center",
  },
  itemImage: {
    borderRadius: theme.spacing.xs,
    height: 80,
    width: 80,
    marginRight: theme.spacing.md,
  },
}));
