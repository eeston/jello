import { useLayoutEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface UseScrollHeaderProps {
  fadeEnd?: number;
  fadeStart?: number;
  navigation: any;
  title: string;
}

export const useScrollHeader = ({
  fadeEnd = 250,
  fadeStart = 200,
  navigation,
  title,
}: UseScrollHeaderProps) => {
  const { styles } = useStyles(stylesheet);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerFadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [fadeStart, fadeEnd], [0, 1], "clamp"),
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Animated.Text
          numberOfLines={1}
          style={[styles.header, headerFadeStyle]}
        >
          {title}
        </Animated.Text>
      ),
      headerTransparent: true,
    });
  }, [navigation, title, headerFadeStyle]);

  return {
    headerFadeStyle,
    scrollHandler,
  };
};

const stylesheet = createStyleSheet(() => ({
  header: {
    // these seem to be the default styles for iOS headers
    fontSize: 17,
    fontWeight: "600",
  },
}));
