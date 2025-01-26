import { DEFAULT_BLUR_HASH } from "@src/util/extractPrimaryHash";
import { Image } from "expo-image";
import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// TODO: animate between blurhashes
export default function NowPlayingBackground({
  blurhash,
}: {
  blurhash?: string;
}) {
  const { styles, theme } = useStyles(stylesheet);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: theme.timing.slow * 60, // sixty seconds
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: 1.5 }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image
        contentFit="cover"
        placeholder={{
          blurhash: blurhash ?? DEFAULT_BLUR_HASH,
        }}
        style={styles.image}
        transition={theme.timing.medium}
      />
    </Animated.View>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    height: runtime.screen.height,
    left: (runtime.screen.width - runtime.screen.height) / 2,
    position: "absolute",
    right: 0,
    top: 0,
    width: runtime.screen.height,
    zIndex: -10,
  },
  image: {
    flex: 1,
  },
}));
