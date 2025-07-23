import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

/**
 * @description some scroll views dont scroll to the bottom so...
 */
export const ScrollViewPadding = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    paddingVertical: rt.screen.height / 4,
  },
}));
