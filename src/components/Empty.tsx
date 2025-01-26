import { ThemedText } from "@src/components/ThemedText";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const EmptyOverlay = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Nothing to see here...</ThemedText>
      <ThemedText>Try reloading?</ThemedText>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left",
  },
}));
