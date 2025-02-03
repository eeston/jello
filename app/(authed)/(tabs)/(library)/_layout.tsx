import { SettingsButton } from "@src/components/SettingsButton";
import { useSearchStore } from "@src/store/useSearchStore";
import { Stack } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Layout() {
  const { styles, theme } = useStyles(stylesheet);
  const { resetQuery, setQuery } = useSearchStore();

  return (
    <Stack
      screenOptions={{
        contentStyle: styles.contentContainer,
        headerBlurEffect: "prominent",
        headerShadowVisible: false,
        headerTitle: "Library",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLargeStyle: { backgroundColor: theme.colors.background },
          headerLargeTitle: true,
          headerRight: SettingsButton,
        }}
      />

      {/* ALBUMS */}
      <Stack.Screen
        name="albums/index"
        options={{
          headerLargeStyle: { backgroundColor: theme.colors.background },
          headerLargeTitle: true,
          headerSearchBarOptions: {
            hideNavigationBar: true,
            hideWhenScrolling: false,
            onChangeText: (e) => {
              setQuery(e.nativeEvent.text);
            },
            onClose: resetQuery,
          },
          headerTintColor: theme.colors.tint,
          headerTitle: "Albums",
        }}
      />
      <Stack.Screen
        name="albums/[id]"
        options={{
          // TODO: workaround...
          // https://github.com/react-navigation/react-navigation/issues/11946#issuecomment-2506102387
          // headerBackButtonDisplayMode: "minimal",
          headerBackButtonDisplayMode: "default",
          headerBackTitle: ".",
          headerBackTitleStyle: { fontSize: 1 },
          //
          headerBlurEffect: undefined,
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />

      {/* ARTISTS */}
      <Stack.Screen
        name="artists/index"
        options={{
          headerLargeStyle: { backgroundColor: theme.colors.background },
          headerLargeTitle: true,
          headerSearchBarOptions: {
            hideNavigationBar: true,
            hideWhenScrolling: false,
            onChangeText: (e) => {
              setQuery(e.nativeEvent.text);
            },
            onClose: resetQuery,
          },
          headerTintColor: theme.colors.tint,
          headerTitle: "Artists",
        }}
      />
      <Stack.Screen
        name="artists/[id]"
        options={{
          // TODO: workaround...
          // https://github.com/react-navigation/react-navigation/issues/11946#issuecomment-2506102387
          // headerBackButtonDisplayMode: "minimal",
          headerBackButtonDisplayMode: "default",
          headerBackTitle: ".",
          headerBackTitleStyle: { fontSize: 1 },
          //
          headerBlurEffect: undefined,
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />

      {/* GENRES */}
      <Stack.Screen
        name="genres/index"
        options={{
          headerLargeStyle: { backgroundColor: theme.colors.background },
          headerLargeTitle: true,
          headerSearchBarOptions: {
            hideNavigationBar: true,
            hideWhenScrolling: false,
            onChangeText: (e) => {
              setQuery(e.nativeEvent.text);
            },
            onClose: resetQuery,
          },
          headerTintColor: theme.colors.tint,
          headerTitle: "Genres",
        }}
      />
      <Stack.Screen
        name="genres/[id]"
        options={{
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
          headerTitle: "",
        }}
      />

      {/* PLAYLISTS */}
      <Stack.Screen
        name="playlists/index"
        options={{
          headerLargeTitle: true,
          headerSearchBarOptions: {
            hideNavigationBar: true,
            hideWhenScrolling: false,
            onChangeText: (e) => {
              setQuery(e.nativeEvent.text);
            },
            onClose: resetQuery,
          },
          headerTintColor: theme.colors.tint,
          headerTitle: "Playlists",
        }}
      />
      <Stack.Screen
        name="playlists/[id]"
        options={{
          // TODO: workaround...
          // https://github.com/react-navigation/react-navigation/issues/11946#issuecomment-2506102387
          // headerBackButtonDisplayMode: "minimal",
          headerBackButtonDisplayMode: "default",
          headerBackTitle: ".",
          headerBackTitleStyle: { fontSize: 1 },
          //
          headerBlurEffect: undefined,
          headerLargeTitle: false,
          headerTintColor: theme.colors.tint,
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
