import { ThemedText } from "@src/components/ThemedText";
import { ActivityIndicator, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const LoadingOverlay = () => {
  const { styles, theme } = useStyles(stylesheet);

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

const stylesheet = createStyleSheet((theme) => ({
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
