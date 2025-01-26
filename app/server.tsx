import { zodResolver } from "@hookform/resolvers/zod";
import { useDiscoverJellyfinServers } from "@src/api/discover";
import { Button } from "@src/components/Button";
import { ThemedText } from "@src/components/ThemedText";
import { ServerSchema, ServerSchemaType } from "@src/schemas/zod/server";
import { openLinkInBrowser } from "@src/util/openLinkInBrowser";
import { router } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, SafeAreaView, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function ServerScreen() {
  const { styles } = useStyles(stylesheet);
  const { control, handleSubmit } = useForm<ServerSchemaType>({
    resolver: zodResolver(ServerSchema),
  });
  const discoverJellyfinServers = useDiscoverJellyfinServers();

  const handleOnPressNext = (data: ServerSchemaType): void => {
    discoverJellyfinServers.mutate(data.url);
  };

  const handleError = () => {
    return Alert.alert("This doesn't look like a valid URL. Try again?");
  };

  const handleOnPressNoServer = () => {
    return Alert.alert(
      "No Server?",
      "This app requires a Jellyfin server to stream your music from.",
      [
        {
          onPress: () => openLinkInBrowser("https://jellyfin.org"),
          text: "Setup new server",
        },
        { style: "cancel", text: "Cancel" },
      ],
    );
  };

  useEffect(() => {
    if (discoverJellyfinServers.isSuccess) {
      router.navigate("/login");
    }
  }, [discoverJellyfinServers.isSuccess]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <ThemedText type="title">Your Jellyfin server</ThemedText>
        <ThemedText type="subtitle">
          Lets find where is your Music hosted...
        </ThemedText>
      </View>
      <Controller
        control={control}
        name="url"
        render={({ field: { onChange, value } }) => {
          return (
            <View style={styles.sectionContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!discoverJellyfinServers.isPending}
                  keyboardType="url"
                  onChangeText={onChange}
                  placeholder="https://jellyfin.yourserver.com/"
                  placeholderTextColor="grey"
                  style={styles.input}
                  testID="server-input"
                  value={value}
                />
              </View>
            </View>
          );
        }}
      />

      <View style={styles.buttonContainer}>
        <Button
          isDisabled={discoverJellyfinServers.isPending}
          isLoading={discoverJellyfinServers.isPending}
          onPress={handleSubmit(handleOnPressNext, handleError)}
          testID="check-connection-button"
          title="Check connection..."
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={discoverJellyfinServers.isPending}
          onPress={handleOnPressNoServer}
          title="No Jellyfin server?"
        />
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  buttonContainer: { paddingBottom: theme.spacing.xs, width: "100%" },
  container: {
    flex: 1,
    marginHorizontal: theme.spacing.lg,
  },
  input: {
    color: theme.colors.primary,
    flex: 1,
    fontSize: 16,
    padding: theme.spacing.sm,
  },
  inputContainer: {
    borderColor: theme.colors.secondary,
    borderRadius: theme.spacing.xs,
    borderWidth: 1,
    flexDirection: "row",
  },
  sectionContainer: {
    marginVertical: theme.spacing.md,
    width: "100%",
  },
}));
