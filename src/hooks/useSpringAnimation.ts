import { useEffect } from "react";
import { Animated } from "react-native";

type Config = Partial<Animated.SpringAnimationConfig>;

export const useSpringAnimation = (
  animatedValue: Animated.Value,
  targetValue: number,
  config: Config = {},
) => {
  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: targetValue,
      useNativeDriver: true,
      ...config,
    }).start();
  }, [animatedValue, targetValue, config]);
};
