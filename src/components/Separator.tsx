import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type SeparatorProps = {
  marginLeft: number;
};

export const Separator = ({ marginLeft }: SeparatorProps) => {
  const { styles } = useStyles(stylesheet);

  return <View style={[styles.container, { marginLeft }]} />;
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
}));
