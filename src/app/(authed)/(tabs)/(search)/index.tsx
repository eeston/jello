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
import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { playTracks } from "@src/util/playTracks";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function LibraryList() {
  const { api } = useAuth();
  const { styles, theme } = useStyles(stylesheet);

  const { query } = useSearchStore();
  const results = useSearchLibrary(api, query);

  const handleOnPressPlayTrack = (track: JelloTrackItem) => {
    playTracks({ tracks: [track] });
  };

  const renderItem = ({ item }: { item: BaseItemDto }) => {
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
                    style={styles.listItemSubText}
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
        <Link
          asChild
          href={{
            params: { id: item.Id },
            pathname: "/albums/[id]",
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
                    style={styles.listItemSubText}
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
        </Link>
      );
    } else if (item.Type === BaseItemKind.Audio) {
      // TODO: tidy this up
      const track = item as JelloTrackItem;
      return (
        <ListItem
          LeftComponent={
            <View style={styles.listItemLeftContainer}>
              <Image
                contentFit="cover"
                placeholder={{
                  blurhash: track.artworkBlur,
                }}
                source={track.artwork}
                style={styles.albumImage}
                transition={theme.timing.medium}
              />
              <View>
                <ThemedText
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.listItemText}
                >
                  {track.title}
                </ThemedText>
                <ThemedText
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.listItemSubText}
                >
                  {`Song • ${track.artist}`}
                </ThemedText>
              </View>
            </View>
          }
          // TODO: add context menu
          // RightComponent={<RightChevron />}
          height={ROW_HEIGHT}
          key={item.Id}
          onPress={() => handleOnPressPlayTrack(track)}
        />
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
  listItemSubText: {
    color: theme.colors.secondary,
    paddingLeft: theme.spacing.sm,
  },
  listItemText: {
    paddingLeft: theme.spacing.sm,
  },
}));
