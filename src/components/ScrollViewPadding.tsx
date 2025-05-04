import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

/**
 * @description some scroll views dont scroll to the bottom so...
 */
export const ScrollViewPadding = () => {
  const { styles } = useStyles(stylesheet);
  return <View style={styles.container} />;
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    paddingVertical: runtime.screen.height / 4,
  },
}));
