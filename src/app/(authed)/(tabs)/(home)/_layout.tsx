import { Stack } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Layout() {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Stack
      screenOptions={{
        contentStyle: styles.contentContainer,
        headerBackButtonDisplayMode: "minimal",
        headerBlurEffect: "prominent",
        headerShadowVisible: false,
        headerTintColor: theme.colors.tint,
        headerTitle: "Home",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLargeStyle: { backgroundColor: theme.colors.background },
          headerLargeTitle: true,
          headerTitle: "Home",
        }}
      />
      <Stack.Screen
        name="albums/[id]"
        options={{
          headerLargeStyle: { backgroundColor: theme.colors.background },
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="artists/[id]/index"
        options={{
          headerBlurEffect: undefined,
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="artists/[id]/top-songs"
        options={{
          headerLargeStyle: { backgroundColor: theme.colors.background },
          headerLargeTitle: false,
          headerTitle: "Top Songs",
        }}
      />
    </Stack>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  contentContainer: {
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: 20,
  },
}));
