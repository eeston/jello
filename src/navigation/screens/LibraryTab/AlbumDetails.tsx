import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { memo, useCallback, useRef } from "react";
import { Animated, FlatList, SafeAreaView, View } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { useActiveTrack } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchAlbumDetails, useFetchAlbumSongs } from "../../../api/albums";
import { useFetchUser } from "../../../api/user";
import { AlbumFooter } from "../../../components/AlbumDetails/Footer";
import { AlbumHeader } from "../../../components/AlbumDetails/Header";
import { ListItem } from "../../../components/ListItem";
import { LoadingOverlay } from "../../../components/Loading";
import { Separator } from "../../../components/Separator";
import { Text } from "../../../components/Themed";
import { ROW_HEIGHT } from "../../../constants";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { usePlayTracks } from "../../../hooks/usePlayTracks";
import { useApi } from "../../../store/useJelloAuth";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type Props = NativeStackScreenProps<LibraryTabParamList, "AlbumDetails">;

export const AlbumDetailsScreen = ({ route }: Props) => {
  const { albumId } = route?.params;
  // if no id...??

  const { styles, theme } = useStyles(stylesheet);
  const flatListRef = useRef<FlatList>(null);
  const api = useApi((state) => state.api);
  const headerHeight = useHeaderHeight();
  const user = useFetchUser(api);
  const albumDetails = useFetchAlbumDetails(api, albumId);
  const albumSongs = useFetchAlbumSongs(api, albumId);
  const currentTrack = useActiveTrack();
  const playTracks = usePlayTracks();

  const onPressAlbumTrack = (trackId: string) => {
    playTracks({
      tracks: albumSongs.data?.Items,
      api,
      userId: user.data?.Id,
      startingTrackId: trackId,
      albumDetails: albumDetails.data,
    });
  };

  const onPressAlbumTrackWithId = (id: string) => () => onPressAlbumTrack(id);

  const opacity = useFadeIn([albumDetails, albumSongs]);

  const SeparatorComponent = memo(() => <Separator marginLeft={50} />);

  const renderItem = useCallback(
    ({ item }: { item: BaseItemDto }) => {
      const isPlaying = currentTrack?.id === item.Id;
      return (
        <View style={styles.itemContainer}>
          {isPlaying ? (
            // TODO: maybe animate this as music wave?
            <SFSymbol
              name="music.note"
              color={theme.colors.primary}
              size={18}
              resizeMode="center"
              style={{
                width: 50,
              }}
            />
          ) : (
            <Text style={styles.indices}>{item.IndexNumber}</Text>
          )}
          <ListItem
            containerStyle={{ flex: 1 }}
            key={item.Id}
            LeftComponent={
              <View style={styles.trackNameContainer}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.trackNameTitle}
                >
                  {item.Name}
                </Text>
              </View>
            }
            // RightComponent={
            //   <View style={styles.trackOptionsContainer}>
            //     <Text style={styles.trackNameTitle}>...</Text>
            //   </View>
            // }
            height={ROW_HEIGHT}
            onPress={onPressAlbumTrackWithId(item.Id)} // TODO: can the id come from the event?
          />
        </View>
      );
    },
    [currentTrack, onPressAlbumTrackWithId],
  );

  if (albumDetails.isPending || albumSongs.isPending) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: -headerHeight,
      }}
    >
      <Animated.FlatList
        ref={flatListRef}
        style={{
          paddingTop: headerHeight + theme.spacing.sm,
          opacity,
        }}
        keyExtractor={(item) => item?.Id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={SeparatorComponent}
        ListHeaderComponent={
          <AlbumHeader
            albumDetails={albumDetails?.data}
            albumSongs={albumSongs.data?.Items}
          />
        }
        ListFooterComponent={
          <AlbumFooter
            albumDetails={albumDetails?.data}
            albumSongs={albumSongs?.data?.Items}
          />
        }
        data={albumSongs.data?.Items}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indices: {
    textAlign: "center",
    width: 50,
    fontSize: 16,
    color: "grey",
  },
  trackNameContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  trackNameTitle: {
    fontSize: 16,
  },
  trackOptionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  trackOptionsTitle: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
  },
}));
