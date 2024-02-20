import { useState } from "react";
import { Alert, SafeAreaView, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Button } from "../../../components/Button";
import { Text } from "../../../components/Themed";
import { useApi, createApi } from "../../../store/useJelloAuth";
import { openLinkInBrowser } from "../../../util/openLinkInBrowser";

export const ServerScreen = ({ navigation }) => {
  const { styles } = useStyles(stylesheet);
  const jellyfin = useApi((state) => state.jellyfin);
  const [serverInput, setServerInput] = useState<string | undefined>(undefined);
  const [isLoadingJellyfinServers, setIsLoadingJellyfinServers] =
    useState(false);

  const onPressNext = () => {
    if (serverInput) {
      try {
        // eslint-disable-next-line no-new
        new URL(serverInput);
      } catch (err) {
        return Alert.alert("This doesn't look like a valid URL. Try again?");
      }
      getJellyfinApi(serverInput);
    }
  };

  const onPressNoServer = () => {
    return Alert.alert(
      "No Server?",
      "This app requires a Jellyfin server to stream your music from.",
      [
        {
          text: "Setup new server",
          onPress: () => openLinkInBrowser("https://jellyfin.org"),
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const getJellyfinApi = (url: string) => {
    setIsLoadingJellyfinServers(true);
    jellyfin?.discovery
      .getRecommendedServerCandidates(url)
      .then((servers) => {
        if (servers.length === 0) {
          Alert.alert("No servers found at this address. Try again?");
          return;
        }

        const best = jellyfin.discovery.findBestServer(servers);
        if (!best) {
          Alert.alert("No servers found at this address. Try again?");
          return;
        }

        createApi({ serverAddress: best.address });
        return navigation.navigate("Login");
      })
      .catch((err) => {
        Alert.alert("Error finding server. Try again?");
      })
      .finally(() => {
        setIsLoadingJellyfinServers(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Your Jellyfin server</Text>
        <Text style={styles.subTitle}>
          Lets find where is your Music hosted...
        </Text>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="https://jellyfin.yourserver.com/"
            placeholderTextColor="grey"
            onChangeText={setServerInput}
            value={serverInput}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoadingJellyfinServers}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={!serverInput || isLoadingJellyfinServers}
          isLoading={isLoadingJellyfinServers}
          onPress={onPressNext}
          title="Check connection..."
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={isLoadingJellyfinServers}
          onPress={onPressNoServer}
          title="No Jellyfin server?"
        />
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    marginHorizontal: theme.spacing.lg,
  },
  sectionContainer: {
    marginVertical: theme.spacing.md,
    width: "100%",
  },
  title: { fontWeight: "bold", fontSize: 28 },
  subTitle: { fontSize: 20, color: "grey" },
  noServerTitle: { fontSize: 16, color: "grey" },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: theme.spacing.sm,
    color: theme.colors.text,
  },
  buttonContainer: { width: "100%", paddingBottom: theme.spacing.xs },
}));
