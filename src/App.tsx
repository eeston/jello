import "react-native-url-polyfill/auto";
import "../src/theme/unistyles";
//
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerRootComponent } from "expo";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { NowPlayingBanner } from "./components/NowPlayingBanner";
import { useCheckCollectionId } from "./hooks/useCollectionId";
import { useSetupPlayer } from "./hooks/usePlayerReady";
import { useSecureStoreItems } from "./hooks/useSecureStoreItems";
import { useSetBackgroundColor } from "./hooks/useSetBackgroundColor";
import { AppNavigator } from "./navigation/navigators/AppNavigator";
import { AuthNavigator } from "./navigation/navigators/AuthNavigator";
import { playbackService } from "./services/player";
import { createApiWithToken, useApi } from "./store/useJelloAuth";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "online",
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => {
  const isPlayerSetup = useSetupPlayer();
  const { styles, theme } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const {
    data,
    isLoading: checkingKeys,
    bothKeysExist,
  } = useSecureStoreItems();
  const { loading: isSettingLibraryId } = useCheckCollectionId();

  // prevent splash screen from flashing white
  // TODO: this makes modal backgrounds weird in light mode
  useSetBackgroundColor();

  useEffect(() => {
    if (bothKeysExist) {
      const [accessToken, serverAddress] = data ?? [];
      createApiWithToken({ serverAddress, token: accessToken });
    }
  }, [bothKeysExist, data, createApiWithToken]);

  const onLayoutRootView = useCallback(async () => {
    if (!checkingKeys && isPlayerSetup && !isSettingLibraryId) {
      SplashScreen.hideAsync();
    }
  }, [checkingKeys, isPlayerSetup, isSettingLibraryId]);

  if (checkingKeys || !isPlayerSetup || isSettingLibraryId) {
    return null;
  }

  return (
    <NavigationContainer theme={theme} onReady={onLayoutRootView}>
      {api?.accessToken ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <SafeAreaInsetsContext.Consumer>
                {(insets) => (
                  <View
                    style={[
                      styles.bannerContainer,
                      { bottom: (insets?.bottom ?? 0) + 50 },
                    ]}
                  >
                    <NowPlayingBanner />
                  </View>
                )}
              </SafeAreaInsetsContext.Consumer>
              <AppNavigator />
            </SafeAreaProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => playbackService);

const stylesheet = createStyleSheet((theme) => ({
  bannerContainer: {
    position: "absolute",
    zIndex: 100,
  },
}));
