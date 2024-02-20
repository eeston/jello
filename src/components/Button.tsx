import { ActivityIndicator, TouchableOpacity } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Text } from "./Themed";

type ButtonProps = {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export const Button = ({
  title,
  isLoading,
  onPress,
  disabled,
}: ButtonProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.container}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator
          size={17} // try to match the text size
          animating
          color="white"
        />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
    borderWidth: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
}));
