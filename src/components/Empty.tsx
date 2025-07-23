import { ThemedText } from "@src/components/ThemedText";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const EmptyOverlay = () => {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Nothing to see here...</ThemedText>
      <ThemedText>Try reloading?</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left",
  },
}));
