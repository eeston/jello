import { useSearchLibraryStore } from "@src/store/useSearchStore";
import { Stack } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Layout() {
  const { styles, theme } = useStyles(stylesheet);
  const { setQuery } = useSearchLibraryStore();

  return (
    <Stack
      screenOptions={{
        contentStyle: styles.contentContainer,
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: theme.colors.tint,
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerBlurEffect: "prominent",
          headerLargeStyle: { backgroundColor: theme.colors.background },
          headerLargeTitle: true,
          headerSearchBarOptions: {
            hideWhenScrolling: false,
            onChangeText: (e) => {
              setQuery(e.nativeEvent.text);
            },
            placeholder: "Artists, Albums, Songs and More",
            tintColor: theme.colors.tint,
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.primary,
          headerTitle: "Search",
        }}
      />

      {/*  */}
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
          headerTitle: "",
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
}));
