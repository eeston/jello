import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import MaskedView from "@react-native-masked-view/masked-view";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { type PropsWithChildren, type ReactElement } from "react";
import { useLayoutEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const HEADER_HEIGHT = Dimensions.get("window").width;
export const ArtworkView = ({
  children,
  headerImage,
  headerOverlay,
  smallBlur,
  title,
}: PropsWithChildren<{
  headerImage: ReactElement;
  headerOverlay: ReactElement;
  smallBlur?: boolean;
  title: BaseItemDto["Name"];
}>) => {
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const { styles } = useStyles(stylesheet);

  // Generate gradient colors and locations
  const { colors, locations } = easeGradient({
    colorStops: {
      0: { color: "transparent" },
      0.5: { color: "rgba(0,0,0,0.99)" },
      1: { color: "black" },
    },
  });

  const headerFadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [HEADER_HEIGHT * 0.6, HEADER_HEIGHT * 0.8],
      [0, 1],
      "clamp",
    ),
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View style={[styles.headerBackground, headerFadeStyle]} />
      ),
      headerTitle: () => (
        <Animated.Text style={[styles.headerTitle, headerFadeStyle]}>
          {title}
        </Animated.Text>
      ),
      headerTransparent: true,
    });
  }, [navigation, title, headerFadeStyle]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [HEADER_HEIGHT * 0.4, HEADER_HEIGHT * 0.8],
        [1, 0],
        "clamp",
      ),
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, 0],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          {headerImage}
          <View style={styles.blurContainer(smallBlur)}>
            <MaskedView
              maskElement={
                <LinearGradient
                  colors={colors}
                  locations={locations}
                  style={StyleSheet.absoluteFill}
                />
              }
              style={StyleSheet.absoluteFill}
            >
              <BlurView style={StyleSheet.absoluteFill} tint="dark" />
            </MaskedView>
            <View style={styles.overlayContent}>{headerOverlay}</View>
          </View>
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  blurContainer: (smallBlur) => ({
    bottom: 0,
    height: smallBlur ? HEADER_HEIGHT / 4 : HEADER_HEIGHT / 2,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 2,
  }),
  container: {
    flex: 1,
  },
  content: {
    // paddingHorizontal: theme.spacing.md,
    // overflow: "hidden",
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  overlayContent: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 3,
  },
  scrollContent: {
    paddingTop: 0,
  },
}));
