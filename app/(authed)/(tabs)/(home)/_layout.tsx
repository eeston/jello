import { Stack } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Layout() {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Stack
      screenOptions={{
        contentStyle: styles.contentContainer,
        // TODO: workaround...
        // https://github.com/react-navigation/react-navigation/issues/11946#issuecomment-2506102387
        // headerBackButtonDisplayMode: "minimal",
        headerBackButtonDisplayMode: "default",
        headerBackTitle: ".",
        headerBackTitleStyle: { fontSize: 1 },
        //
        headerBlurEffect: "prominent",
        headerLargeStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          headerTitle: "Home",
        }}
      />
      <Stack.Screen
        name="albums/[id]"
        options={{
          headerBackTitle: " ",
          headerBlurEffect: undefined,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
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
  },
}));
