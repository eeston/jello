import { NowPlayingBanner } from "@src/components/NowPlayingBanner";
import { useIsSignedIn } from "@src/store/AuthContext";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function AppLayout() {
  const { styles } = useStyles(stylesheet);
  const isSignedIn = useIsSignedIn();

  // You can keep the splash screen open, or render a loading screen like we do here.
  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isSignedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/welcome" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ contentStyle: styles.contentContainer }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="nowPlaying"
          options={{
            headerShown: false,
            presentation: "formSheet",
          }}
        />
      </Stack>
      <NowPlayingBanner />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: theme.colors.background,
  },
}));
