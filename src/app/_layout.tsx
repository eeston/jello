import "@src/theme/unistyles"; // must be first thing imported

// eslint-disable-next-line perfectionist/sort-imports
import { playbackService } from "@src/services/player";
import { AuthProvider } from "@src/store/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StrictMode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import TrackPlayer, {
  Capability,
  IOSCategory,
  IOSCategoryMode,
  IOSCategoryOptions,
} from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

TrackPlayer.registerPlaybackService(() => playbackService);

const PLAYER_OPTIONS = {
  capabilities: [
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    Capability.Pause,
    Capability.Play,
  ],
};

async function initializePlayer() {
  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
      iosCategory: IOSCategory.Playback,
      iosCategoryMode: IOSCategoryMode.Default,
      iosCategoryOptions: [
        IOSCategoryOptions.AllowBluetooth,
        IOSCategoryOptions.AllowAirPlay,
      ],
    });

    await TrackPlayer.updateOptions({
      ...PLAYER_OPTIONS,
      progressUpdateEventInterval: 10,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "The player has already been initialized via setupPlayer."
    ) {
      return;
    }
    throw error;
  }
}

initializePlayer();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [loaded] = useFonts({
  // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  // });

  // useEffect(() => {
  // if (loaded) {
  SplashScreen.hideAsync();
  // }
  // }, [loaded]);

  // if (!loaded) {
  // return null;
  // }

  return <Layout />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retryOnMount: true,
      staleTime: 0,
    },
  },
});

function Layout() {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <StrictMode>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Stack
              initialRouteName="welcome"
              screenOptions={{
                contentStyle: styles.contentContainer,
                headerShadowVisible: false,
                headerTintColor: theme.colors.tint,
                headerTransparent: true,
              }}
            >
              <Stack.Screen
                name="(authed)"
                options={{
                  headerShown: false,
                  title: "Login",
                }}
              />
              <Stack.Screen
                name="login"
                options={{ headerShown: true, title: "" }}
              />
              <Stack.Screen
                name="welcome"
                options={{ headerShown: true, title: "" }}
              />
              <Stack.Screen
                name="server"
                options={{ headerShown: true, title: "" }}
              />
            </Stack>
          </QueryClientProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </StrictMode>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  contentContainer: {
    backgroundColor: theme.colors.background,
  },
}));
