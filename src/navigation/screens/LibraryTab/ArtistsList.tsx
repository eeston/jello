import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { View, SafeAreaView, Animated } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchArtists } from "../../../api/artists";
import { ListItem } from "../../../components/ListItem";
import { LoadingOverlay } from "../../../components/Loading";
import { Separator } from "../../../components/Separator";
import { Text } from "../../../components/Themed";
import { ROW_HEIGHT } from "../../../constants";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { useApi } from "../../../store/useJelloAuth";
import { extractPrimaryHash } from "../../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../../util/generateTrackArtworkUrl";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type Props = NativeStackScreenProps<LibraryTabParamList, "ArtistsList">;

export const ArtistsListScreen = ({ navigation }: Props) => {
  const api = useApi((state) => state.api);
  const artists = useFetchArtists(api);
  const headerHeight = useHeaderHeight();
  const { styles, theme } = useStyles(stylesheet);

  const onPressArtistItem = useCallback(
    (artistId: string) => {
      return navigation.navigate("ArtistDetails", { artistId });
    },
    [navigation],
  );

  const opacity = useFadeIn([artists]);

  if (artists.isPending) {
    return <LoadingOverlay />;
  }

  const renderItem = ({ item }: { item: BaseItemDto }) => (
    <ListItem
      style={styles.listItemContainer}
      key={item.Id}
      LeftComponent={
        <View style={styles.listItemLeftContainer}>
          <Image
            style={styles.listItemLeftImage}
            source={generateTrackArtworkUrl({ id: item?.Id, api })}
            placeholder={extractPrimaryHash(item.ImageBlurHashes)}
            contentFit="cover"
            transition={300}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.listItemText}
          >
            {item.Name}
          </Text>
        </View>
      }
      height={ROW_HEIGHT}
      onPress={() => onPressArtistItem(item.Id)}
    />
  );

  const SeparatorComponent = memo(() => <Separator marginLeft={75} />);

  return (
    <SafeAreaView style={{ flex: 1, marginTop: -headerHeight }}>
      {/* https://stackoverflow.com/questions/44384773/react-native-100-items-flatlist-very-slow-performance */}
      <Animated.FlatList
        style={{ paddingTop: headerHeight + theme.spacing.sm, opacity }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={artists.data?.Items}
        renderItem={renderItem}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        ItemSeparatorComponent={SeparatorComponent}
        ListFooterComponent={<View style={{ height: headerHeight + 200 }} />}
      />
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  listItemContainer: { paddingHorizontal: theme.spacing.md },
  listItemLeftContainer: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    alignItems: "center",
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
