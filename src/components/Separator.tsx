import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type SeparatorProps = {
  color?: string;
  marginLeft?: number;
  marginRight?: number;
};

export const Separator = ({ color, marginLeft = 0 }: SeparatorProps) => {
  return (
    <View
      style={[
        styles.container,
        { borderColor: color ?? styles.container.borderColor, marginLeft },
      ]}
    />
  );
};

const styles = StyleSheet.create((theme) => {
  return {
    container: {
      borderColor: theme.colors.translucent,
      borderWidth: StyleSheet.hairlineWidth,
    },
  };
});
