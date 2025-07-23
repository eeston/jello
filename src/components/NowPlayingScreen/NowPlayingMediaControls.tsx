import { useTrackedActiveTrack } from "@src/hooks/useTrackedActiveTrack";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import TrackPlayer, { useIsPlaying } from "react-native-track-player";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export const NowPlayingMediaControls = ({
  isLiveStream,
}: {
  isLiveStream: boolean;
}) => {
  const { theme } = useUnistyles();
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
        <TouchableOpacity
          disabled={isLiveStream}
          onPress={handleOnPressSkipBackward}
        >
          <SymbolView
            name="backward.fill"
            resizeMode="scaleAspectFit"
            size={theme.symbol.xl}
            tintColor={isLiveStream ? "grey" : "white"}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        disabled={isLoading}
        onPress={handleOnPressTogglePlayPause}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size={theme.symbol.xl} />
        ) : (
          <SymbolView
            name={isPlaying ? "pause.fill" : "play.fill"}
            resizeMode="scaleAspectFit"
            size={theme.symbol.xl}
            tintColor="white"
          />
        )}
      </TouchableOpacity>
      {!isLiveStream && (
        <TouchableOpacity
          disabled={isLiveStream}
          onPress={handleOnPressSkipForward}
        >
          <SymbolView
            name="forward.fill"
            resizeMode="scaleAspectFit"
            size={theme.symbol.xl}
            tintColor="white"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.md,
  },
}));
