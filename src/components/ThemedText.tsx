import { Text, type TextProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type ThemedTextProps = TextProps & {
  darkColor?: string;
  lightColor?: string;
  type?: "default" | "defaultSemiBold" | "link" | "subtitle" | "title";
};

export function ThemedText({
  darkColor,
  lightColor,
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        styles.text,
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  link: {
    color: "#0a7ea4",
    fontSize: 16,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    color: theme.colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
}));
