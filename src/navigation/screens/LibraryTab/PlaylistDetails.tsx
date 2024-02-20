import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRef } from "react";
import { Animated, FlatList, SafeAreaView, View } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { useActiveTrack } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import {
  useFetchPlaylistDetails,
  useFetchPlaylistSongs,
} from "../../../api/playlists";
import { useFetchUser } from "../../../api/user";
import { ListItem } from "../../../components/ListItem";
import { LoadingOverlay } from "../../../components/Loading";
import { PlaylistFooter } from "../../../components/PlaylistDetails/Footer";
import { PlaylistHeader } from "../../../components/PlaylistDetails/Header";
import { Separator } from "../../../components/Separator";
import { Text } from "../../../components/Themed";
import { ROW_HEIGHT } from "../../../constants";
import { useFadeIn } from "../../../hooks/useFadeInView";
import { usePlayTracks } from "../../../hooks/usePlayTracks";
import { useApi } from "../../../store/useJelloAuth";
import { extractPrimaryHash } from "../../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../../util/generateTrackArtworkUrl";
import { LibraryTabParamList } from "../../navigators/LibraryTabNavigator";

type Props = NativeStackScreenProps<LibraryTabParamList, "PlaylistDetails">;

export const PlaylistDetailsScreen = ({ route }: Props) => {
  const { playlistId } = route.params;
  // if no id...

  const flatListRef = useRef<FlatList>(null);
  const { styles, theme } = useStyles(stylesheet);
  const headerHeight = useHeaderHeight();

  const api = useApi((state) => state.api);

  const user = useFetchUser(api);
  const playlistDetails = useFetchPlaylistDetails(api, playlistId);
  const playlistSongs = useFetchPlaylistSongs(api, playlistId);
  const currentTrack = useActiveTrack();
  const playTracks = usePlayTracks();

  const opacity = useFadeIn([playlistDetails, playlistSongs]);

  if (playlistDetails.isPending || playlistSongs.isPending) {
    return <LoadingOverlay />;
  }

  const onPressPlaylistTrack = (trackId: string) => {
    playTracks({
      tracks: playlistSongs.data?.Items,
      api,
      userId: user.data?.Id,
      startingTrackId: trackId,
    });
  };

  const renderItem = ({ item }: { item: BaseItemDto }) => {
    const isPlaying = currentTrack?.id === item.Id;
    return (
      <ListItem
        style={{ paddingHorizontal: 20 }}
        key={item.Id}
        LeftComponent={
          <View
            style={{
              // flexDirection: "row",
              // marginVertical: spacing.xs,
              flexDirection: "row",
              height: ROW_HEIGHT,
              // justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                // flex: 1,
                borderRadius: 5,
                height: 50,
                width: 50,
              }}
              source={generateTrackArtworkUrl({ id: item?.Id, api })}
              placeholder={extractPrimaryHash(item?.ImageBlurHashes)}
              contentFit="cover"
              transition={300}
            >
              {isPlaying && (
                <BlurView style={{ flex: 1 }} intensity={40} tint="dark">
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SFSymbol
                      name="music.note"
                      color={theme.colors.primary}
                      size={24}
                      resizeMode="center"
                    />
                  </View>
                </BlurView>
              )}
            </Image>
            <View
              style={{
                // justifyContent: "center",
                marginHorizontal: theme.spacing.md,
              }}
            >
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{ fontSize: 16, paddingRight: 70 }}
              >
                {item.Name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "grey",
                  fontWeight: "bold",
                }}
              >
                {item.AlbumArtist}
              </Text>
            </View>
          </View>
        }
        // RightComponent={
        //   <View
        //     style={{
        //       marginVertical: spacing.md,
        //     }}
        //   >
        //     <Text style={{ fontSize: 16, fontWeight: "bold" }}>...</Text>
        //   </View>
        // }
        height={ROW_HEIGHT}
        onPress={() => onPressPlaylistTrack(item.Id)} // TODO: can the id come from the event?
      />
    );
  };

  const SeparatorComponent = () => <Separator marginLeft={85} />;

  return (
    <SafeAreaView style={[styles.container, { marginTop: -headerHeight }]}>
      <Animated.FlatList
        ref={flatListRef}
        keyExtractor={(item) => item.Id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <PlaylistHeader
            playlistDetails={playlistDetails.data}
            playlistSongs={playlistSongs.data?.Items}
          />
        }
        ListFooterComponent={PlaylistFooter}
        data={playlistSongs.data?.Items}
        renderItem={renderItem}
        ItemSeparatorComponent={SeparatorComponent}
        style={{ paddingTop: headerHeight + theme.spacing.sm, opacity }}
      />
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
}));
