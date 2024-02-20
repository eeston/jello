import { Dimensions, Pressable } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Text } from "./Themed";

const buttonTypes = {
  play: {
    title: "Play",
    icon: "play.fill",
  },
  shuffle: {
    title: "Shuffle",
    icon: "shuffle",
  },
};

type MusicButtonProps = {
  type: "play" | "shuffle";
  onPress: () => void;
};

export const MusicButton = ({ type, onPress }: MusicButtonProps) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <SFSymbol
        name={buttonTypes[type].icon}
        color={theme.colors.primary}
        size={16}
        resizeMode="center"
        style={styles.symbol}
      />
      <Text style={styles.text}>{buttonTypes[type].title}</Text>
    </Pressable>
  );
};

const stylesheet = createStyleSheet((theme) => {
  const size = Dimensions.get("window").width / 2.4; // maybe this is repsonsive between screen sizes??
  return {
    container: {
      width: size,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.buttonSecondaryBackground,
      borderRadius: theme.spacing.sm,
      borderWidth: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    symbol: {
      marginHorizontal: theme.spacing.md,
    },
    text: {
      fontWeight: "500",
      color: theme.colors.primary,
      textAlign: "center",
      fontSize: 18,
    },
  };
});
