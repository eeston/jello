import { useSearchLibraryStore } from "@src/store/useSearchStore";
import { Stack } from "expo-router";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function Layout() {
  const { theme } = useUnistyles();
  const { setQuery } = useSearchLibraryStore();

  return (
    <Stack
      screenOptions={{
        contentStyle: styles.contentContainer,
        headerBackButtonDisplayMode: "minimal",
        headerBlurEffect: "prominent",
        headerTintColor: theme.colors.tint,
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
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
          headerBlurEffect: "prominent",
          headerLargeTitle: false,
          headerTitle: "Top Songs",
          headerTitleStyle: { color: theme.colors.primary },
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create((theme) => ({
  contentContainer: {
    backgroundColor: theme.colors.background,
  },
}));
