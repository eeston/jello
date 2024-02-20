import { ActivityIndicator, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const LoadingOverlay = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <ActivityIndicator animating color="grey" />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    zIndex: 100,
  },
}));
