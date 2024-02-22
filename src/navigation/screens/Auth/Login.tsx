import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Alert, SafeAreaView, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Button } from "../../../components/Button";
import { Text } from "../../../components/Themed";
import {
  STORE_ACCESS_TOKEN_KEY,
  STORE_SERVER_ADDRESS_KEY,
} from "../../../constants";
import { createApiWithToken, useApi } from "../../../store/useJelloAuth";

export const LoginScreen = ({ navigation }) => {
  const { styles } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const [isAuthenticatingUser, setIsAuthenticatingUser] = useState(false);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  if (!api) {
    return navigation.goBack();
  }

  const authUser = async () => {
    setIsAuthenticatingUser(true);
    try {
      const auth = await api?.authenticateUserByName(
        usernameInput,
        passwordInput,
      );
      return auth;
    } catch (error) {
      console.error(error);
    } finally {
      setIsAuthenticatingUser(false);
    }
  };

  const handleLogin = async () => {
    const auth = await authUser();

    if (auth?.data?.AccessToken && api?.basePath) {
      await Promise.all([
        SecureStore.setItemAsync(
          STORE_ACCESS_TOKEN_KEY,
          auth?.data?.AccessToken,
        ),
        SecureStore.setItemAsync(STORE_SERVER_ADDRESS_KEY, api.basePath),
      ]);

      createApiWithToken({
        serverAddress: api.basePath,
        token: auth?.data?.AccessToken,
      });
    } else {
      Alert.alert("Incorrect Username or Password!");
    }
  };

  const isDemoServer = api?.basePath === "https://demo.jellyfin.org/stable";

  const isButtonDisabled = () => {
    return (
      isAuthenticatingUser ||
      (isDemoServer ? !usernameInput : !usernameInput || !passwordInput)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subTitle}>Enter your Jellyfin credentials</Text>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsernameInput}
            value={usernameInput}
            keyboardType="default"
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect={false}
            editable={!isAuthenticatingUser}
            testID="username-input"
          />
        </View>
        {!isDemoServer && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={setPasswordInput}
              value={passwordInput}
              keyboardType="default"
              autoCapitalize="none"
              autoComplete="password"
              secureTextEntry
              autoCorrect={false}
              editable={!isAuthenticatingUser}
            />
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleLogin}
          title="Login"
          isLoading={isAuthenticatingUser}
          disabled={isButtonDisabled()}
          testID="login-button"
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
  inputContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.spacing.xs,
    marginBottom: theme.spacing.xxxs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: theme.spacing.sm,
    color: theme.colors.text,
  },
  buttonContainer: { width: "100%" },
}));
