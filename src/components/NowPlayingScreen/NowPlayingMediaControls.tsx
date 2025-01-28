import { useTrackedActiveTrack } from "@src/hooks/useTrackedActiveTrack";
import { useAudioStore } from "@src/store/audioStore";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";
import TrackPlayer, { useIsPlaying } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingMediaControls = ({
  isLiveStream,
}: {
  isLiveStream: boolean;
}) => {
  const { styles } = useStyles(stylesheet);
  const currentTrack = useTrackedActiveTrack();
  const { playing: isPlaying } = useIsPlaying();

  const { isLoading } = useAudioStore();

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
            size={40}
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
            size={40}
            tintColor="white"
          />
        )}
      </Pressable>
      {!isLiveStream && (
        <Pressable disabled={isLiveStream} onPress={handleOnPressSkipForward}>
          <SymbolView
            name="forward.fill"
            resizeMode="scaleAspectFit"
            size={40}
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
