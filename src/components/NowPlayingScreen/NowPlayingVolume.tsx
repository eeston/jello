import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface NowPlayingVolumeProps {
  onVolumeChange?: (volume: number) => void;
}

export const NowPlayingVolume = ({ onVolumeChange }: NowPlayingVolumeProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const [volume, setVolume] = useState(50);

  const progressWidth = useSharedValue(volume);

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  const clampValue = (value: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(value, min), max);
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startValue: number }
  >({
    onActive: (event, context) => {
      "worklet";
      const newVolume = context.startValue + event.translationX / 3;
      progressWidth.value = clampValue(newVolume, 0, 100);
      runOnJS(updateVolume)(progressWidth.value);
    },
    onEnd: () => {
      "worklet";
      progressWidth.value = withSpring(progressWidth.value, {
        damping: 20,
        stiffness: 90,
      });
    },
    onStart: (_, context) => {
      "worklet";
      context.startValue = progressWidth.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      width: `${progressWidth.value}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconLeft}>
        <SymbolView
          name="speaker.fill"
          resizeMode="scaleAspectFit"
          size={theme.symbol.xs}
          tintColor="#ffffff6a"
        />
      </View>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={styles.progressBar}>
          <Animated.View style={[styles.progress, animatedStyle]} />
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.iconRight}>
        <SymbolView
          name="speaker.wave.3.fill"
          resizeMode="scaleAspectFit"
          size={theme.symbol.sm}
          tintColor="#ffffff6a"
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: theme.spacing.xl,
    width: "100%",
  },
  iconLeft: { paddingRight: theme.spacing.xs },
  iconRight: { paddingLeft: theme.spacing.xs },
  progress: {
    backgroundColor: "#ffffff6a",
    borderBottomRightRadius: 0,
    borderRadius: 5,
    borderTopRightRadius: 0,
    height: "100%",
  },
  progressBar: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    flex: 1,
    height: 6,
    width: "100%",
  },
}));
