import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AirplayButton, showRoutePicker } from "react-airplay";
import { ActivityIndicator, Animated, Pressable, View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import {
  ContextMenuButton,
  MenuActionConfig,
} from "react-native-ios-context-menu";
import LinearGradient from "react-native-linear-gradient";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { SFSymbol } from "react-native-sfsymbols";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { PressableSFSymbol } from "../../../components/PressableSFSymbol";
import { TitleScroll } from "../../../components/ScrollableText";
import { Text } from "../../../components/Themed";
import { useSpringAnimation } from "../../../hooks/useSpringAnimation";
import { secondsToMmSs } from "../../../util/time";

const shouldShowPlaying = [State.Playing, State.Loading, State.Buffering];
const shouldShowLoading = [State.Loading, State.Buffering];

// temporary toggle to show the buffer progress for testing
const bufferToggle = false;

export const NowPlayingModal = ({ navigation }) => {
  const { styles, theme } = useStyles(stylesheet);

  const { position, buffered } = useProgress();
  const playerState = usePlaybackState();
  const currentTrack = useActiveTrack();

  const albumArtworkScale = useRef(new Animated.Value(1)).current;
  const sliderScale = useRef(new Animated.ValueXY({ x: 1, y: 1 })).current;

  const [isSlidingTrackProgress, setIsSlidingTrackProgress] = useState(false);

  const trackProgressProgress = useDerivedValue(() => {
    if (!isSlidingTrackProgress) {
      return Number(position.toFixed(0));
    }
  }, [position]);

  const trackBufferProgress = useSharedValue<number>(
    Number(buffered.toFixed(0)),
  );

  const trackProgressMin = useSharedValue<number>(0);
  const trackProgressMax = useSharedValue<number>(currentTrack?.duration ?? 0);

  useEffect(() => {
    trackBufferProgress.value = Number(buffered.toFixed(0));
  }, [buffered]);

  useEffect(() => {
    trackProgressMax.value = currentTrack?.duration ?? 0;
  }, [currentTrack]);

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

  useEffect(() => {
    Animated.spring(sliderScale, {
      toValue: isSlidingTrackProgress ? { x: 1.1, y: 2 } : { x: 1, y: 1 },
      useNativeDriver: true,
    }).start();
  }, [isSlidingTrackProgress]);

  const handleSlidingStart = useCallback(() => {
    setIsSlidingTrackProgress(true);
  }, []);

  const handleSlidingComplete = async (seekToTimestamp: number) => {
    // TODO: this doesn't seek too far back/forward
    // buffering is also not working as expected
    await TrackPlayer.seekTo(Math.floor(seekToTimestamp));
    setIsSlidingTrackProgress(false);
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
              <View>
                <TitleScroll text={currentTrack?.title} />
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
                  <Text style={styles.songArtist}>{currentTrack?.artist}</Text>
                </ContextMenuButton>
              </View>
              <ContextMenuButton
                style={{
                  padding: 12,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
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
              {bufferToggle && (
                <Slider
                  progress={trackBufferProgress}
                  minimumValue={trackProgressMin}
                  maximumValue={trackProgressMax}
                  theme={{
                    maximumTrackTintColor: "rgba(255, 255, 255, 0.4)",
                    minimumTrackTintColor: "rgba(255, 255, 255, 0.8)",
                  }}
                />
              )}
              {/* temporary block of code to track buffer progress */}

              <Animated.View
                style={[
                  styles.animatedProgressContainer,
                  {
                    transform: [
                      { scaleX: sliderScale.x },
                      { scaleY: sliderScale.y },
                    ],
                  },
                ]}
              >
                <Slider
                  progress={trackProgressProgress}
                  minimumValue={trackProgressMin}
                  maximumValue={trackProgressMax}
                  renderThumb={() => null}
                  renderBubble={() => null}
                  theme={{
                    maximumTrackTintColor: "rgba(255, 255, 255, 0.4)",
                    minimumTrackTintColor: "rgba(255, 255, 255, 0.8)",
                  }}
                  // TODO: how to animate the borderRadius to match the animated container
                  containerStyle={{ borderRadius: 8, height: 8 }}
                  onSlidingStart={handleSlidingStart}
                  onSlidingComplete={handleSlidingComplete}
                />
              </Animated.View>
              <View style={styles.songTimeContainer}>
                <Text style={styles.songTicker}>{secondsToMmSs(position)}</Text>
                <Text style={styles.songTicker}>
                  - {secondsToMmSs(currentTrack?.duration - position)}
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
  songTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
  },
  songArtist: {
    fontSize: 20,
    color: "rgba(255,255,255,0.5)",
  },
  contextMenuButton: {
    alignSelf: "flex-start",
  },
  songProgressContainer: {
    // TODO: come back and fix vertical padding
    paddingHorizontal: theme.spacing.md,
  },
  songTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
