import { NavigationProp } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { TextStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface UseScrollHeaderProps {
  fadeEnd?: number;
  fadeStart?: number;
  navigation: any;
  title: string;
  titleStyle?: TextStyle;
}

export const useScrollHeader = ({
  fadeEnd = 250,
  fadeStart = 200,
  navigation,
  title,
  titleStyle,
}: UseScrollHeaderProps) => {
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
        <Animated.Text numberOfLines={1} style={[titleStyle, headerFadeStyle]}>
          {title}
        </Animated.Text>
      ),
      headerTransparent: true,
    });
  }, [navigation, title, headerFadeStyle, titleStyle]);

  return {
    headerFadeStyle,
    scrollHandler,
  };
};
