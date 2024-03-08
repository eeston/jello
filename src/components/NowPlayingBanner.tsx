import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useCallback } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
} from "react-native-track-player";
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from "react-native-unistyles";

import { PressableSFSymbol } from "./PressableSFSymbol";
import { Text } from "./Themed";

const shouldShowLoading = [State.Loading, State.Buffering];

export const NowPlayingBanner = () => {
  const { styles, theme } = useStyles(stylesheet);
  const navigation = useNavigation();
  const playerState = usePlaybackState();
  const currentTrack = useActiveTrack();

  const isPlaying = playerState.state === State.Playing;
  const onPressPlayPause = useCallback(() => {
    TrackPlayer.setPlayWhenReady(!isPlaying);
  }, [playerState.state]);

  const onPressNextSong = useCallback(() => {
    TrackPlayer.skipToNext();
  }, []);

  const onPressBanner = useCallback(() => {
    if (currentTrack) {
      return navigation.navigate("NowPlayingModal");
    }
  }, [currentTrack, navigation]);

  return (
    <View style={styles.shadowContainer}>
      <BlurView
        intensity={90}
        tint={UnistylesRuntime.themeName}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Pressable onPress={onPressBanner} style={styles.pressableContainer}>
            {currentTrack?.artworkBlurHash ? (
              <Image
                style={styles.albumArtwork}
                source={currentTrack?.artwork}
                placeholder={currentTrack?.artworkBlurHash}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <View style={styles.albumArtwork} />
            )}
            <Text numberOfLines={1} style={styles.title}>
              {currentTrack?.title ?? "Not Playing"}
            </Text>
          </Pressable>
          <View style={styles.buttonContainer}>
            {shouldShowLoading.includes(playerState.state) ? (
              <ActivityIndicator animating color={theme.colors.text} />
            ) : (
              <PressableSFSymbol
                name={isPlaying ? "pause.fill" : "play.fill"}
                color={theme.colors.text}
                onPress={onPressPlayPause}
                size={24}
                disabled={!currentTrack}
              />
            )}
            <PressableSFSymbol
              name="forward.fill"
              color={theme.colors.text}
              size={24}
              onPress={onPressNextSong}
              disabled={!currentTrack}
            />
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  shadowContainer: {
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
  },
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    borderRadius: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    height: theme.spacing.xxl + theme.spacing.xs,
    // width: "100%",
    overflow: "hidden",

    //
    // shadowColor: isDark ? "white" : "grey",
  },

  innerContainer: {
    // is this required?
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  pressableContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 3,
  },
  albumArtwork: {
    marginLeft: theme.spacing.xs,
    marginVertical: theme.spacing.xs,
    backgroundColor: "grey",
    // backgroundColor: "#0553",
    borderRadius: theme.spacing.xs,
    height: theme.spacing.xxl - theme.spacing.xxs,
    width: theme.spacing.xxl - theme.spacing.xxs,
  },
  title: {
    height: "100%",
    // overflow: "scroll",
    fontWeight: "500",
    fontSize: 16,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.xl,
  },
  buttonContainer: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    // justifyContent: "flex-end",
    justifyContent: "space-around",
    marginHorizontal: theme.spacing.sm,
  },
}));
