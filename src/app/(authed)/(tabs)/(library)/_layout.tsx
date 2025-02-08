import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { SettingsButton } from "@src/components/SettingsButton";
import { useSearchStore } from "@src/store/useSearchStore";
import { Stack } from "expo-router";
import { StyleProp } from "react-native";
import { SearchBarProps } from "react-native-screens";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Layout() {
  const { styles, theme } = useStyles(stylesheet);
  const { resetQuery, setQuery } = useSearchStore();

  const COMMON_SEARCH_HEADER_PROPS: {
    headerLargeStyle?: StyleProp<{
      backgroundColor?: string;
    }>;
  } & {
    headerLargeTitle?: boolean;
  } & { headerSearchBarOptions: SearchBarProps } = {
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
  };

  const BACK_BUTTON_WORKAROUND: Pick<
    NativeStackNavigationOptions,
    "headerBackButtonDisplayMode" | "headerBackTitle" | "headerBackTitleStyle"
  > = {
    // we just want to use headerBackButtonDisplayMode here but it's currently broken
    // https://github.com/react-navigation/react-navigation/issues/11946#issuecomment-2506102387
    // headerBackButtonDisplayMode: "minimal",
    // TODO: workaround...
    headerBackButtonDisplayMode: "default",
    headerBackTitle: ".",
    headerBackTitleStyle: { fontSize: 1 },
  };

  return (
    <Stack
      screenOptions={{
        contentStyle: styles.contentContainer,
        headerBlurEffect: "prominent",
        headerShadowVisible: false,
        headerTintColor: theme.colors.tint,
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
          ...COMMON_SEARCH_HEADER_PROPS,
          headerTitle: "Albums",
        }}
      />
      <Stack.Screen
        name="albums/[id]"
        options={{
          ...BACK_BUTTON_WORKAROUND,
          headerLargeStyle: { backgroundColor: theme.colors.background },
        }}
      />

      {/* ARTISTS */}
      <Stack.Screen
        name="artists/index"
        options={{
          ...COMMON_SEARCH_HEADER_PROPS,
          headerTitle: "Artists",
        }}
      />
      <Stack.Screen
        name="artists/[id]"
        options={{
          ...BACK_BUTTON_WORKAROUND,
          headerBlurEffect: undefined,
          headerLargeTitle: false,
        }}
      />

      {/* GENRES */}
      <Stack.Screen
        name="genres/index"
        options={{
          ...COMMON_SEARCH_HEADER_PROPS,
          headerTitle: "Genres",
        }}
      />
      <Stack.Screen
        name="genres/[id]"
        options={{
          ...COMMON_SEARCH_HEADER_PROPS,
        }}
      />

      {/* PLAYLISTS */}
      <Stack.Screen
        name="playlists/index"
        options={{
          ...COMMON_SEARCH_HEADER_PROPS,
          headerTitle: "Playlists",
        }}
      />
      <Stack.Screen
        name="playlists/[id]"
        options={{
          ...BACK_BUTTON_WORKAROUND,
          headerLargeStyle: { backgroundColor: theme.colors.background },
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
