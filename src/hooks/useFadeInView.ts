import { UseQueryResult } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export const useFadeIn = (dependencies: UseQueryResult[]) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (dependencies.every((dep) => dep.isSuccess)) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        delay: 100,
        useNativeDriver: true,
      }).start();
    }
  }, dependencies);

  return opacity;
};
