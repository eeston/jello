import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Text } from "./Themed";

type TextGroupProps = {
  rows: { leftText: string; rightText?: string; onPress?: () => void }[];
};

export const TextGroup = ({ rows }: TextGroupProps) => {
  const { styles } = useStyles(stylesheet);

  const textRows = rows.map((row, i) => {
    const isFirst = i === 0;
    const isLast = i === rows.length - 1;

    const borderRadii: StyleProp<ViewStyle> = {
      borderTopRightRadius: isFirst ? 10 : 0,
      borderTopLeftRadius: isFirst ? 10 : 0,
      borderBottomRightRadius: isLast ? 10 : 0,
      borderBottomLeftRadius: isLast ? 10 : 0,
    };

    return (
      <Pressable
        key={i}
        style={({ pressed }) => [
          { opacity: row.onPress && pressed ? 0.5 : 1.0 },
        ]}
        onPress={row.onPress}
      >
        <View style={[styles.row, { ...borderRadii }]}>
          <Text style={styles.textLeft}>{row.leftText}</Text>
          <Text style={styles.textRight}>{row.rightText}</Text>
        </View>
      </Pressable>
    );
  });
  return <View style={styles.container}>{textRows}</View>;
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingBottom: theme.spacing.lg,
  },
  row: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textLeft: {
    color: theme.colors.text,
  },
  textRight: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
}));
