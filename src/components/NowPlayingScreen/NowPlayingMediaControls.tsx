import { useTrackedActiveTrack } from "@src/hooks/useTrackedActiveTrack";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";
import TrackPlayer, { useIsPlaying } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingMediaControls = ({
  isLiveStream,
}: {
  isLiveStream: boolean;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const currentTrack = useTrackedActiveTrack();
  const { bufferingDuringPlay: isLoading, playing: isPlaying } = useIsPlaying();

  const handleOnPressSkipForward = () => {
    if (currentTrack) {
      TrackPlayer.skipToNext();
    }
  };

  const handleOnPressSkipBackward = () => {
    if (currentTrack) {
      TrackPlayer.skipToPrevious();
    }
  };

  const handleOnPressTogglePlayPause = () => {
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  return (
    <View style={styles.container}>
      {!isLiveStream && (
        <Pressable disabled={isLiveStream} onPress={handleOnPressSkipBackward}>
          <SymbolView
            name="backward.fill"
            resizeMode="scaleAspectFit"
            size={theme.symbol.lg}
            tintColor={isLiveStream ? "grey" : "white"}
          />
        </Pressable>
      )}
      <Pressable disabled={isLoading} onPress={handleOnPressTogglePlayPause}>
        {isLoading ? (
          <ActivityIndicator color="white" size={32} />
        ) : (
          <SymbolView
            name={isPlaying ? "pause.fill" : "play.fill"}
            resizeMode="scaleAspectFit"
            size={theme.symbol.lg}
            tintColor="white"
          />
        )}
      </Pressable>
      {!isLiveStream && (
        <Pressable disabled={isLiveStream} onPress={handleOnPressSkipForward}>
          <SymbolView
            name="forward.fill"
            resizeMode="scaleAspectFit"
            size={theme.symbol.lg}
            tintColor="white"
          />
        </Pressable>
      )}
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
}));
