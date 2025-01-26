import * as Haptics from "expo-haptics";
import React, { PropsWithChildren } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { ThemedText } from "./ThemedText";

interface ButtonProps extends React.ComponentProps<typeof Pressable> {
  color?: "red";
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
  style?: object;
  textStyle?: object;
  title?: string;
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  color = "red",
  isDisabled = false,
  isLoading = false,
  onPress,
  style = {},
  textStyle = {},
  title,
  ...props
}) => {
  const { styles } = useStyles(stylesheet);

  const handleOnPress = () => {
    if (!isLoading && !isDisabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <Pressable
      disabled={isDisabled || isLoading}
      onPress={handleOnPress}
      style={({ pressed }) => [
        styles.button,
        (isLoading || isDisabled) && styles.isDisabled,
        style,
        { opacity: pressed ? 0.5 : 1 },
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <View style={styles.contentContainer}>
          <ThemedText style={[styles.text, textStyle]} type="defaultSemiBold">
            {title}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.tint,
    borderRadius: theme.spacing.sm,
    justifyContent: "center",
    padding: theme.spacing.sm,
  },
  contentContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  isDisabled: {
    opacity: 0.5,
  },
  text: {
    color: "white",
    lineHeight: undefined,
  },
}));
