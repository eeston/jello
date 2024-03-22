import Slider from "@react-native-community/slider";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useCallback, useMemo, useRef } from "react";
import { AirplayButton, showRoutePicker } from "react-airplay";
import { ActivityIndicator, Animated, Pressable, View } from "react-native";
import {
  ContextMenuButton,
  MenuActionConfig,
} from "react-native-ios-context-menu";
import LinearGradient from "react-native-linear-gradient";
import { SFSymbol } from "react-native-sfsymbols";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { TempBufferSlider } from "./_tempBufferSlider";
import { PressableSFSymbol } from "../../../components/PressableSFSymbol";
import { TitleScroll } from "../../../components/ScrollableText";
import { Text } from "../../../components/Themed";
import { useSpringAnimation } from "../../../hooks/useSpringAnimation";
import { secondsToMmSs } from "../../../util/time";

const shouldShowPlaying = [State.Playing, State.Loading, State.Buffering];
const shouldShowLoading = [State.Loading, State.Buffering];

export const NowPlayingModal = ({ navigation }) => {
  const { styles, theme } = useStyles(stylesheet);

  const { position, buffered } = useProgress();
  const playerState = usePlaybackState();
  const currentTrack = useActiveTrack();

  const albumArtworkScale = useRef(new Animated.Value(1)).current;

  useSpringAnimation(
    albumArtworkScale,
    shouldShowPlaying.includes(playerState.state) ? 1.0 : 0.7,
    {
      bounciness: shouldShowPlaying.includes(playerState.state) ? 10 : 1,
      speed: 3,
    },
  );

  const onPressPlayPause = useCallback(() => {
    TrackPlayer.setPlayWhenReady(playerState.state !== State.Playing);
  }, [playerState.state]);

  const onPressPreviousSong = useCallback(() => {
    TrackPlayer.skipToPrevious();
  }, []);

  const onPressNextSong = useCallback(() => {
    TrackPlayer.skipToNext();
  }, []);

  const onPressMenuItem = ({
    nativeEvent,
  }: {
    nativeEvent: MenuActionConfig;
  }) => {
    const [view, id] = nativeEvent.actionKey.split(".");
    navigation.goBack(); // close the modal
    if (view === "ALBUM") {
      return navigation.navigate("LibraryTab", {
        screen: "AlbumDetails",
        params: { albumId: id },
        initial: false,
      });
    } else if (view === "ARTIST") {
      return navigation.navigate("LibraryTab", {
        screen: "ArtistDetails",
        params: { artistId: id },
        initial: false,
      });
    }
  };

  const colors = useMemo(
    () => [
      currentTrack?.artworkPrimary ?? theme.colors.background,
      currentTrack?.artworkBackground ?? theme.colors.background,
      currentTrack?.artworkSecondary ?? theme.colors.background,
    ],
    [currentTrack, theme.colors.background],
  );

  const handleSlidingComplete = async (seekToTimestamp: number) => {
    // TODO: this doesn't seek too far back/forward
    // buffering is also not working as expected
    await TrackPlayer.seekTo(Math.floor(seekToTimestamp));
  };

  return (
    <LinearGradient
      // TODO: do some fudging
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1.6 }}
      colors={colors}
      style={{
        flex: 1,
      }}
    >
      <BlurView style={styles.blurContainer} tint="dark" intensity={50}>
        <View style={styles.innerContainer}>
          {/* ALBUM ARTWORK */}
          <View style={styles.artworkContainer}>
            <Animated.View
              style={{ transform: [{ scale: albumArtworkScale }] }}
            >
              <Image
                style={styles.artwork}
                source={currentTrack?.artwork}
                placeholder={currentTrack?.artworkBlurHash}
                contentFit="cover"
                transition={300}
              />
            </Animated.View>
          </View>

          {/* SONG DETAILS / PROGRESS BAR */}
          <View>
            <View style={styles.songDetailsContainer}>
              <View style={{ maxWidth: "90%" }}>
                <TitleScroll text={currentTrack?.title} type="title" />
                <ContextMenuButton
                  style={styles.contextMenuButton}
                  menuConfig={{
                    menuTitle: "", // no title required
                    menuItems: [
                      currentTrack?.albumId && {
                        actionKey: `ALBUM.${currentTrack.albumId}`,
                        actionTitle: "Go to Album",
                        actionSubtitle: currentTrack?.album,
                        icon: {
                          type: "IMAGE_SYSTEM",
                          imageValue: {
                            systemName: "square.stack",
                          },
                        },
                      },
                      currentTrack?.artistId && {
                        actionKey: `ARTIST.${currentTrack.artistId}`,
                        actionTitle: "Go to Artist",
                        actionSubtitle: currentTrack?.artist,
                        icon: {
                          type: "IMAGE_SYSTEM",
                          imageValue: {
                            systemName: "music.mic",
                          },
                        },
                      },
                    ],
                  }}
                  onPressMenuItem={onPressMenuItem}
                >
                  <TitleScroll text={currentTrack?.artist} type="subtitle" />
                </ContextMenuButton>
              </View>
              <ContextMenuButton
                style={styles.optionsButton}
                menuConfig={{
                  menuTitle: "", // no title required
                  menuItems: [
                    currentTrack?.albumId && {
                      actionKey: `ALBUM.${currentTrack.albumId}`,
                      actionTitle: "Go to Album",
                      icon: {
                        type: "IMAGE_SYSTEM",
                        imageValue: {
                          systemName: "music.note.house", // correct icon?
                        },
                      },
                    },
                  ],
                }}
                onPressMenuItem={onPressMenuItem}
              >
                <SFSymbol
                  name="ellipsis"
                  color="rgba(255,255,255,0.8)"
                  size={16}
                />
              </ContextMenuButton>
            </View>
            <View style={styles.songProgressContainer}>
              {/* temporary block of code to track buffer progress */}
              <TempBufferSlider
                min={0}
                max={currentTrack?.duration ?? 0}
                value={buffered}
              />
              {/* temporary block of code to track buffer progress */}
              <Slider
                style={{ width: "100%" }}
                minimumValue={0}
                maximumValue={currentTrack?.duration ?? 0}
                minimumTrackTintColor="rgba(255, 255, 255, 0.8)"
                thumbImage={require("../../../../assets/images/transparent-pixel.png")}
                value={position}
                onSlidingComplete={handleSlidingComplete}
                tapToSeek
              />
              <View style={styles.songTimeContainer}>
                <Text style={styles.songTicker}>{secondsToMmSs(position)}</Text>
                <Text style={styles.songTicker}>
                  - {secondsToMmSs((currentTrack?.duration ?? 0) - position)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <PressableSFSymbol
              name="backward.fill"
              onPress={onPressPreviousSong}
              color="rgba(255,255,255,0.8)"
              size={32}
            />

            {shouldShowLoading.includes(playerState.state) ? (
              <ActivityIndicator
                style={{ width: 50, height: 50 }}
                animating
                color="rgba(255,255,255,0.8)"
              />
            ) : (
              <PressableSFSymbol
                name={
                  playerState.state === State.Playing
                    ? "pause.fill"
                    : "play.fill"
                }
                onPress={onPressPlayPause}
                color="rgba(255,255,255,0.8)"
                size={50}
              />
            )}
            <PressableSFSymbol
              name="forward.fill"
              onPress={onPressNextSong}
              color="rgba(255,255,255,0.8)"
              size={32}
            />
          </View>

          {/* AIRPLAY */}
          <View style={styles.airplayContainer}>
            {/* button for lyrics */}
            <Pressable
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => showRoutePicker({ prioritizesVideoDevices: true })}
            >
              <AirplayButton
                prioritizesVideoDevices
                tintColor="rgba(255,255,255,0.8)"
                activeTintColor={theme.colors.primary}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </Pressable>
            {/* button for queue */}
          </View>
        </View>
      </BlurView>
    </LinearGradient>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  blurContainer: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.md,
  },
  artworkContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: theme.spacing.md,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: theme.spacing.xxl,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  artwork: {
    borderRadius: theme.spacing.sm,
    height: 320,
    width: 320,
  },
  songDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  contextMenuButton: {
    alignSelf: "flex-start",
  },
  songProgressContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  songTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionsButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  songTicker: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    fontWeight: "bold",
  },
  controlsContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxxl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  airplayContainer: {
    padding: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  animatedProgressContainer: {
    flex: 1,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
}));
