import { StyleSheet, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type SeparatorProps = {
  color?: string;
  marginLeft?: number;
  marginRight?: number;
};

export const Separator = ({ color, marginLeft = 0 }: SeparatorProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View
      style={[
        styles.container,
        { borderColor: color ?? styles.container.borderColor, marginLeft },
      ]}
    />
  );
};

const stylesheet = createStyleSheet((theme) => {
  return {
    container: {
      borderColor: theme.colors.translucent,
      borderWidth: StyleSheet.hairlineWidth,
    },
  };
});
