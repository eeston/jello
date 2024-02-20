import { Text as RNText } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function Text(props: RNText["props"]) {
  const { styles } = useStyles(stylesheet);
  const { style, ...otherProps } = props;

  return <RNText style={[styles.text, style]} {...otherProps} />;
}

const stylesheet = createStyleSheet((theme) => ({
  text: {
    color: theme.colors.text,
  },
}));
