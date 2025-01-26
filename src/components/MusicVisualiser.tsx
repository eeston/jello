import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface Props {
  backgroundColor?: string;
  barColor?: string;
  barCount?: number;
  barHeight?: number;
  barWidth?: number;
  isPlaying: boolean;
}

const DEFAULT_BAR_COUNT = 6;
const BASE_DURATION = 500;

export const MusicVisualizer = ({
  backgroundColor = "rgba(0,5,0,0.3)",
  barColor = "red",
  barCount = DEFAULT_BAR_COUNT,
  barHeight = 12,
  barWidth = 2,
  isPlaying,
}: Props) => {
  const { styles } = useStyles(stylesheet);
  // eslint-disable-next-line react-compiler/react-compiler
  const animatedValues = useRef(
    Array(barCount)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current;

  const [prominentBars, setProminentBars] = useState<number[]>([]);
  const [barOpacities] = useState(
    Array(barCount)
      .fill(0)
      .map(() => new Animated.Value(0.6)),
  );

  const randomScales = useRef(
    Array(barCount)
      .fill(0)
      .map(() => getRandomScale()),
  ).current;

  function getRandomScale() {
    return 0.2 + Math.random() * 0.8;
  }

  function getRandomDuration() {
    return BASE_DURATION * (0.3 + Math.random() * 1.2);
  }

  const pulseOpacity = (opacity: Animated.Value) => {
    Animated.sequence([
      Animated.timing(opacity, {
        duration: 600 + Math.random() * 400,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: 600 + Math.random() * 400,
        toValue: 0.6,
        useNativeDriver: true,
      }),
    ]).start(() => pulseOpacity(opacity));
  };

  useEffect(() => {
    let updateInterval: NodeJS.Timeout;

    if (isPlaying) {
      barOpacities.forEach((opacity) => pulseOpacity(opacity));

      updateInterval = setInterval(
        () => {
          const numberOfProminentBars = Math.floor(Math.random() * 3) + 1;
          const newProminentBars: number[] = [];

          while (newProminentBars.length < numberOfProminentBars) {
            const newBar = Math.floor(Math.random() * barCount);
            if (!newProminentBars.includes(newBar)) {
              newProminentBars.push(newBar);
            }
          }

          setProminentBars(newProminentBars);

          randomScales.forEach((_, i) => {
            randomScales[i] = getRandomScale();
          });
        },
        100 + Math.random() * 250,
      );

      const animations = animatedValues.map((value) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              duration: getRandomDuration(),
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              duration: getRandomDuration(),
              toValue: 0,
              useNativeDriver: true,
            }),
          ]),
          { iterations: -1 },
        );
      });

      animations.forEach((animation) => animation.start());

      return () => {
        animations.forEach((animation) => animation.stop());
        clearInterval(updateInterval);
      };
    } else {
      animatedValues.forEach((value) => value.setValue(0));
      barOpacities.forEach((opacity) => opacity.setValue(0.6));
    }
  }, [isPlaying]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* eslint-disable-next-line react-compiler/react-compiler */}
      {animatedValues.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor: barColor,
              height: barHeight,
              opacity: barOpacities[index],
              transform: [
                {
                  scaleY: value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      0.1,
                      prominentBars.includes(index) ? 1.8 : randomScales[index],
                    ],
                  }),
                },
              ],
              width: barWidth,
            },
          ]}
        />
      ))}
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  bar: {
    borderRadius: 1,
  },
  container: {
    alignItems: "center",
    bottom: 0,
    flexDirection: "row",
    gap: 1.5,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    top: 0,
  },
}));
