import {
  BaseItemDtoQueryResult,
  BaseItemDto,
} from "@jellyfin/sdk/lib/generated-client";
import { useNavigation } from "@react-navigation/native";
import { UseQueryResult } from "@tanstack/react-query";
import { View, FlatList } from "react-native";
import { useStyles, createStyleSheet } from "react-native-unistyles";

import { AlbumCard } from "./AlbumCard";
import { Text } from "./Themed";
import { useApi } from "../store/useJelloAuth";
import { extractPrimaryHash } from "../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../util/generateTrackArtworkUrl";

export const AlbumCarousel = ({
  request,
  title,
}: {
  request: UseQueryResult<BaseItemDtoQueryResult, Error>;
  title: string;
}) => {
  const { styles } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const navigation = useNavigation();

  if (!request.data?.Items?.length) {
    return null;
  }

  const renderItem = ({ item }: { item: BaseItemDto }) => {
    const onPressRecentlyPlayedAlbum = async () => {
      return navigation.navigate("AlbumDetails", {
        albumId: item.AlbumId,
      });
    };

    return (
      <AlbumCard
        title={item.Album ?? "Unknown Album"}
        subTitle={item.AlbumArtist ?? "Unknown Artist"}
        imageUrl={generateTrackArtworkUrl({ id: item.AlbumId, api })}
        imageHash={extractPrimaryHash(item?.ImageBlurHashes)}
        onPress={onPressRecentlyPlayedAlbum}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={request.data?.Items}
        renderItem={renderItem}
        horizontal
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.flatlistContent}
      />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: { paddingTop: theme.spacing.lg },
  title: {
    fontSize: 20,
    paddingBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontWeight: "bold",
  },
  flatlistContent: {
    paddingHorizontal: theme.spacing.md,
  },
  separator: {
    width: theme.spacing.sm,
  },
}));
