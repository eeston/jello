import {
  BaseItemDto,
  BaseItemDtoQueryResult,
} from "@jellyfin/sdk/lib/generated-client";
import { AlbumCard, AlbumCardSize } from "@src/components/AlbumCard";
import { RightChevron } from "@src/components/RightChevron";
import { ThemedText } from "@src/components/ThemedText";
import { useAuth } from "@src/store/AuthContext";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { UseQueryResult } from "@tanstack/react-query";
import { Link } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export const AlbumCarousel = ({
  identifier,
  large,
  linkTo,
  replace,
  request,
  title,
}: {
  identifier: "AlbumId" | "Id";
  large?: boolean;
  linkTo?: "/favourite-albums" | "/frequently-played" | "/recently-played"; // TODO: how to get types?
  replace?: boolean;
  request: UseQueryResult<BaseItemDtoQueryResult, Error>;
  title: string;
}) => {
  const { theme } = useUnistyles();
  const { api } = useAuth();

  const CARD_WIDTH = large ? AlbumCardSize.large : AlbumCardSize.small;

  if (!request.data?.Items?.length) {
    return null;
  }

  const renderItem = ({ item }: { item: BaseItemDto }) => {
    const id = item[identifier];

    if (!id || !api) {
      return null;
    }

    return (
      <Link
        asChild
        href={{
          params: { id },
          pathname: `/albums/[id]`,
        }}
        key={id}
        replace={!!replace}
      >
        <AlbumCard
          imageHash={extractPrimaryHash(item?.ImageBlurHashes)}
          imageUrl={generateArtworkUrl({ api, id: item[identifier] })}
          large={large}
          subTitle={item.AlbumArtist ?? "Unknown Artist"}
          title={
            (identifier === "Id" ? item.Name : item.Album) ?? "Unknown Album"
          }
        />
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      {linkTo ? (
        <Link asChild href={linkTo}>
          <Pressable style={{ alignItems: "center", flexDirection: "row" }}>
            <ThemedText style={styles.title} type="subtitle">
              {title}
            </ThemedText>
            <RightChevron />
          </Pressable>
        </Link>
      ) : (
        <ThemedText style={styles.title} type="subtitle">
          {title}
        </ThemedText>
      )}

      <FlatList
        contentContainerStyle={styles.flatlistContent}
        data={request.data?.Items}
        decelerationRate="fast"
        horizontal
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={CARD_WIDTH + theme.spacing.sm}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {},
  flatlistContent: {
    paddingHorizontal: theme.spacing.md,
  },
  separator: {
    width: theme.spacing.sm,
  },
  title: {
    paddingBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
}));
