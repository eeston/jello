import { StyleSheet, View } from "react-native";
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from "react-native-unistyles";

type SeparatorProps = {
  marginLeft?: number;
  marginRight?: number;
};

export const Separator = ({ marginLeft = 0 }: SeparatorProps) => {
  const { styles } = useStyles(stylesheet);

  return <View style={[styles.container, { marginLeft }]} />;
};

const stylesheet = createStyleSheet(() => {
  const isLightTheme = UnistylesRuntime.themeName === "light";
  return {
    container: {
      // TODO: add to theme
      borderColor: isLightTheme
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.2)",
      borderWidth: StyleSheet.hairlineWidth,
    },
  };
});
