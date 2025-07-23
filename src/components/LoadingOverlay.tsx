import { ThemedText } from "@src/components/ThemedText";
import { ActivityIndicator, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export const LoadingOverlay = () => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View>
        <ActivityIndicator
          animating
          color={theme.colors.secondary}
          size="large"
        />
        <ThemedText style={styles.text}>Loading...</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    zIndex: 100,
  },
  text: {
    color: theme.colors.secondary,
    paddingTop: theme.spacing.sm,
  },
}));
