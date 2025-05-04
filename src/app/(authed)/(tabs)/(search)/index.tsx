import { BaseItemDto, BaseItemKind } from "@jellyfin/sdk/lib/generated-client";
import { useSearchLibrary } from "@src/api/useSearchLibrary";
import { ListItem } from "@src/components/ListItem";
import { ListPadding } from "@src/components/ListPadding";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { RightChevron } from "@src/components/RightChevron";
import { Separator } from "@src/components/Separator";
import { ThemedText } from "@src/components/ThemedText";
import { ROW_HEIGHT } from "@src/constants";
import { useAuth } from "@src/store/AuthContext";
import { useSearchStore } from "@src/store/useSearchStore";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function LibraryList() {
  const { api } = useAuth();
  const { styles, theme } = useStyles(stylesheet);

  const { query } = useSearchStore();
  const results = useSearchLibrary(api, query);

  const renderItem = ({ item }: { item: BaseItemDto }) => {
    if (!item.Id) {
      return null;
    }
    // console.log(item.Type );
    if (item.Type === BaseItemKind.MusicArtist) {
      return (
        <Link
          asChild
          href={{
            params: { id: item.Id },
            pathname: "/artists/[id]",
          }}
        >
          <ListItem
            LeftComponent={
              <View style={styles.listItemLeftContainer}>
                <Image
                  contentFit="cover"
                  placeholder={{
                    blurhash: extractPrimaryHash(item.ImageBlurHashes),
                  }}
                  source={generateArtworkUrl({ api, id: item?.Id })}
                  style={styles.artistImage}
                  transition={theme.timing.medium}
                />
                <View>
                  <ThemedText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.listItemText}
                  >
                    {item.Name}
                  </ThemedText>
                  <ThemedText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.listItemText}
                  >
                    Artist
                  </ThemedText>
                </View>
              </View>
            }
            RightComponent={<RightChevron />}
            height={ROW_HEIGHT}
            key={item.Id}
          />
        </Link>
      );
    } else if (item.Type === BaseItemKind.MusicAlbum) {
      return (
        <Pressable
        // play album
        >
          <ListItem
            LeftComponent={
              <View style={styles.listItemLeftContainer}>
                <Image
                  contentFit="cover"
                  placeholder={{
                    blurhash: extractPrimaryHash(item.ImageBlurHashes),
                  }}
                  source={generateArtworkUrl({ api, id: item?.Id })}
                  style={styles.albumImage}
                  transition={theme.timing.medium}
                />
                <View>
                  <ThemedText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.listItemText}
                  >
                    {item.Name}
                  </ThemedText>
                  <ThemedText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.listItemText}
                  >
                    {`Album • ${item.AlbumArtist}`}
                  </ThemedText>
                </View>
              </View>
            }
            RightComponent={<RightChevron />}
            height={ROW_HEIGHT}
            key={item.Id}
          />
        </Pressable>
      );
    } else if (item.Type === BaseItemKind.Audio) {
      return (
        <Pressable
        // play album and skip to track
        >
          <ListItem
            LeftComponent={
              <View style={styles.listItemLeftContainer}>
                <Image
                  contentFit="cover"
                  placeholder={{
                    blurhash: extractPrimaryHash(item.ImageBlurHashes),
                  }}
                  source={generateArtworkUrl({ api, id: item?.Id })}
                  style={styles.albumImage}
                  transition={theme.timing.medium}
                />
                <View>
                  <ThemedText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.listItemText}
                  >
                    {item.Name}
                  </ThemedText>
                  <ThemedText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.listItemText}
                  >
                    {`Song • ${item.AlbumArtist}`}
                  </ThemedText>
                </View>
              </View>
            }
            RightComponent={<RightChevron />}
            height={ROW_HEIGHT}
            key={item.Id}
          />
        </Pressable>
      );
    }
    return null;
  };

  if (results.isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <FlatList
      ItemSeparatorComponent={() => <Separator marginLeft={60} />}
      ListFooterComponent={ListPadding}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={results?.data?.Items}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  albumImage: {
    borderRadius: theme.spacing.xxs,
    height: theme.spacing.xxl,
    width: theme.spacing.xxl,
  },
  artistImage: {
    borderRadius: theme.spacing.xxl,
    height: theme.spacing.xxl,
    width: theme.spacing.xxl,
  },
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  listItemLeftContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: ROW_HEIGHT,
  },
  listItemText: {
    fontSize: 16,
    paddingLeft: theme.spacing.sm,
    paddingRight: 80,
  },
}));
