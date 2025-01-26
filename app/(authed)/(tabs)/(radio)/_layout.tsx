import { Stack } from "expo-router";
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from "react-native-unistyles";

export default function Layout() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Stack
      screenOptions={{
        contentStyle: styles.contentContainer,
        headerBlurEffect: UnistylesRuntime.themeName,
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerTitle: "Radio",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
        // headerRight: () => (),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  contentContainer: {
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    color: theme.colors.primary,
  },
}));
