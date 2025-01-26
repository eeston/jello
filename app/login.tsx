import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthenticateUserByName } from "@src/api/useAuthenticateUserByName";
import { useCreateApiWithToken } from "@src/api/useCreateApiWithToken";
import { Button } from "@src/components/Button";
import { ThemedText } from "@src/components/ThemedText";
// import { DEMO_SERVER } from "@src/constants";
import { LoginSchema, LoginSchemaType } from "@src/schemas/zod/login";
import { useAuth } from "@src/store/AuthContext";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, SafeAreaView, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function LoginScreen() {
  const { styles } = useStyles(stylesheet);
  const { control, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });
  const { api } = useAuth();
  const authenticateUserByName = useAuthenticateUserByName();
  const createApiWithToken = useCreateApiWithToken();

  if (!api) {
    router.back();
    return;
  }

  const handleOnSubmit = async (data: LoginSchemaType) => {
    try {
      const authResult = await authenticateUserByName.mutateAsync({
        api,
        password: data.password,
        username: data.username,
      });

      const accessToken = authResult?.data?.AccessToken;
      const basePath = api?.basePath;

      if (accessToken && basePath) {
        await createApiWithToken.mutateAsync({
          accessToken,
          basePath,
        });

        router.navigate("/(authed)/(tabs)/(home)");
      } else {
        Alert.alert("Authentication Failed", "Invalid credentials");
      }
    } catch (error: any) {
      Alert.alert(
        "Login Error",
        error?.message ?? "An unexpected error occurred",
      );
    }
  };

  const handleError = () => {
    return Alert.alert("Make sure you've entered your username and password.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <ThemedText type="title">Login</ThemedText>
        <ThemedText type="subtitle">Enter your Jellyfin credentials</ThemedText>
      </View>
      <View style={styles.sectionContainer}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => {
            return (
              <View style={styles.inputContainer}>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect={false}
                  editable={!authenticateUserByName.isPending}
                  keyboardType="default"
                  onChangeText={onChange}
                  placeholder="Username"
                  style={styles.input}
                  testID="username-input"
                  value={value}
                />
              </View>
            );
          }}
        />
        <View style={styles.spacer} />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => {
            return (
              <View style={styles.inputContainer}>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect={false}
                  editable={!authenticateUserByName.isPending}
                  keyboardType="default"
                  onChangeText={onChange}
                  placeholder="Password"
                  secureTextEntry
                  style={styles.input}
                  value={value}
                />
              </View>
            );
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={authenticateUserByName.isPending}
          isLoading={authenticateUserByName.isPending}
          onPress={handleSubmit(handleOnSubmit, handleError)}
          testID="login-button"
          title="Login"
        />
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  buttonContainer: { width: "100%" },
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
  spacer: {
    padding: theme.spacing.xxxs,
  },
}));
