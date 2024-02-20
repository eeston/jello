import { TouchableOpacity } from "react-native";
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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <SFSymbol
        name={buttonTypes[type].icon}
        color={theme.colors.primary}
        size={16}
        resizeMode="center"
        style={styles.symbol}
      />
      <Text style={styles.text}>{buttonTypes[type].title}</Text>
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: 150,
    paddingVertical: 12,
    backgroundColor: theme.colors.buttonSecondaryBackground,
    borderRadius: 10,
    borderWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: {
    marginRight: 16,
  },
  text: {
    fontWeight: "500",
    color: theme.colors.primary,
    textAlign: "center",
    fontSize: 18,
  },
}));
