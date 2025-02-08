import { Separator } from "@src/components/Separator";
import { ThemedText } from "@src/components/ThemedText";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type TextGroupProps = {
  rows: { leftText: string; onPress?: () => void; rightText?: string }[];
};

export const TextGroup = ({ rows }: TextGroupProps) => {
  const { styles, theme } = useStyles(stylesheet);

  const textRows = rows.map((row, i) => {
    const isFirst = i === 0;
    const isLast = i === rows.length - 1;

    const borderRadii: StyleProp<ViewStyle> = {
      borderBottomLeftRadius: isLast ? 10 : 0,
      borderBottomRightRadius: isLast ? 10 : 0,
      borderTopLeftRadius: isFirst ? 10 : 0,
      borderTopRightRadius: isFirst ? 10 : 0,
    };

    return (
      <View>
        <Pressable
          key={i}
          onPress={row.onPress}
          style={({ pressed }) => [
            { opacity: row.onPress && pressed ? 0.5 : 1.0 },
          ]}
        >
          <View style={[styles.row, { ...borderRadii }]}>
            <ThemedText>{row.leftText}</ThemedText>
            <ThemedText>{row.rightText}</ThemedText>
          </View>
        </Pressable>
        {!isLast && <Separator color={theme.colors.background} />}
      </View>
    );
  });
  return <View style={styles.container}>{textRows}</View>;
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingBottom: theme.spacing.lg,
  },
  row: {
    backgroundColor: theme.colors.translucent,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing.sm,
  },
}));
