import { SettingsButton } from "@src/components/SettingsButton";
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
        // TODO: workaround...
        // https://github.com/react-navigation/react-navigation/issues/11946#issuecomment-2506102387
        // headerBackButtonDisplayMode: "minimal",
        headerBackButtonDisplayMode: "default",
        headerBackTitle: ".",
        headerBackTitleStyle: { fontSize: 1 },
        //
        headerShadowVisible: false,
        headerTitle: "Library",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeTitle: true,
          headerRight: SettingsButton,
        }}
      />

      {/* ALBUMS */}
      <Stack.Screen
        name="albums/index"
        options={{
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="albums/[id]"
        options={{
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />

      {/* ARTISTS */}
      <Stack.Screen
        name="artists/index"
        options={{
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="artists/[id]"
        options={{
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />

      {/* GENRES */}
      <Stack.Screen
        name="genres/index"
        options={{
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="genres/[id]"
        options={{
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />

      {/* PLAYLISTS */}
      <Stack.Screen
        name="playlists/index"
        options={{
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="playlists/[id]"
        options={{
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />

      {/* SETTINGS */}
      <Stack.Screen
        name="modal"
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitle: "Settings",
          headerTransparent: false,
          presentation: "formSheet",
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
