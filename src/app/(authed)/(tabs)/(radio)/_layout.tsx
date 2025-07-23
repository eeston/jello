import { Stack } from "expo-router";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function Layout() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        contentStyle: styles.contentContainer,
        headerBlurEffect: "prominent",
        headerLargeStyle: { backgroundColor: theme.colors.background },
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerTitle: "Radio",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

const styles = StyleSheet.create((theme) => ({
  contentContainer: {
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    color: theme.colors.primary,
  },
}));
