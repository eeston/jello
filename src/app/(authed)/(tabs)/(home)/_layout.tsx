import { BACK_BUTTON_WORKAROUND } from "@src/common";
import { Stack } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Layout() {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Stack
      screenOptions={{
        contentStyle: styles.contentContainer,
        headerBlurEffect: "prominent",
        headerShadowVisible: false,
        headerTintColor: theme.colors.tint,
        headerTitle: "Home",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
        ...BACK_BUTTON_WORKAROUND,
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
          headerBlurEffect: "prominent",
          headerLargeStyle: { backgroundColor: theme.colors.background },
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="artists/[id]"
        options={{
          headerBlurEffect: undefined,
          headerLargeTitle: false,
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
