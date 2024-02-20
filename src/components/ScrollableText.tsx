import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const { UIManager } = NativeModules;

const SCROLL_DELAY = 2000;
const SCROLL_GAP = 50;
const SCROLL_SPEED = 40;

interface TitleScrollProps {
  text: string;
}

// TODO: don't think I will use this anywhere else but maybe work
// on making it a little more reuseable
export const TitleScroll = ({ text }: TitleScrollProps) => {
  const [contentFits, setContentFits] = useState(true);
  const [textWidth, setTextWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const { styles } = useStyles(stylesheet);

  useEffect(() => {
    animatedValue.stopAnimation();
    animatedValue.setValue(0);
    calculateTextSize().then((contentFits) => {
      if (!contentFits) {
        startAnimation();
      }
    });
  }, [text, textWidth, contentFits]);

  useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (animation.current) animation.current.stop();
    };
  }, []);

  const startAnimation = () => {
    timeoutId.current = setTimeout(() => {
      if (!contentFits) {
        scroll();
      }
    }, SCROLL_DELAY);
  };

  const scroll = () => {
    if (animation.current) {
      animation.current.stop();
    }

    const scrollToValue = -textWidth - SCROLL_GAP;
    animation.current = Animated.timing(animatedValue, {
      toValue: scrollToValue,
      duration: Math.abs(scrollToValue) * SCROLL_SPEED,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    animation.current.start(({ finished }) => {
      if (finished) {
        setTimeout(() => {
          animatedValue.setValue(0);
          scroll();
        }, SCROLL_DELAY);
      }
    });
  };

  const measure = async (
    ref: React.RefObject<any>,
  ): Promise<{ width: number }> => {
    return new Promise((resolve, reject) => {
      if (ref.current) {
        UIManager.measure(
          findNodeHandle(ref.current),
          (x: number, y: number, width: number) => {
            resolve({ width });
          },
        );
      } else {
        reject();
      }
    });
  };

  const calculateTextSize = async () => {
    try {
      const [{ width: containerWidth }, { width: textWidth }] =
        await Promise.all([measure(containerRef), measure(textRef)]);
      const contentFits = textWidth - containerWidth <= 1;
      setTextWidth(textWidth);
      setContentFits(contentFits);
      return contentFits;
    } catch (_err) {
      // default to fits
      return true;
    }
  };

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        style={[styles.text, { opacity: contentFits ? 1 : 0 }]}
      >
        {text}
      </Text>
      <ScrollView
        ref={containerRef}
        horizontal
        scrollEnabled={!contentFits}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={StyleSheet.absoluteFillObject}
        onContentSizeChange={calculateTextSize}
      >
        {/* text that gets scrolled */}
        <Animated.Text
          ref={textRef}
          numberOfLines={1}
          style={[
            styles.text,
            {
              transform: [{ translateX: animatedValue }],
              opacity: !contentFits ? 1 : 0,
              width: null,
            },
          ]}
        >
          {text}
        </Animated.Text>

        {/* second bit of text scrolls but is used to create seamless loop */}
        {!contentFits && (
          <View style={{ paddingLeft: SCROLL_GAP }}>
            <Animated.Text
              numberOfLines={1}
              style={[
                styles.text,
                {
                  transform: [{ translateX: animatedValue }],
                  opacity: !contentFits ? 1 : 0,
                  width: null,
                },
              ]}
            >
              {text}
            </Animated.Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    overflow: "hidden",
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
  },
  fadeLeft: {
    position: "absolute",
    left: 0,
    height: "100%",
    width: 50,
  },
  fadeRight: {
    position: "absolute",
    right: 0,
    height: "100%",
    width: 50,
  },
}));
