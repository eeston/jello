import { ThemedText } from "@src/components/ThemedText";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { SFSymbol, SymbolView } from "expo-symbols";
import { Dimensions, Pressable } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const buttonTypes = {
  play: {
    icon: "play.fill" as SFSymbol,
    title: "Play",
  },
  shuffle: {
    icon: "shuffle" as SFSymbol,
    title: "Shuffle",
  },
};

type MusicButtonProps = {
  onPress: () => void;
  type: "play" | "shuffle";
};

export const MusicButton = ({ onPress, type }: MusicButtonProps) => {
  const { styles } = useStyles(stylesheet);

  const handleOnPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <BlurView style={styles.container} tint="light">
      <Pressable
        onPress={handleOnPress}
        style={({ pressed }) => [styles.inner, { opacity: pressed ? 0.5 : 1 }]}
      >
        <SymbolView
          name={buttonTypes[type].icon}
          resizeMode="scaleAspectFit"
          size={18}
          tintColor="white"
        />
        <ThemedText style={styles.text} type="defaultSemiBold">
          {buttonTypes[type].title}
        </ThemedText>
      </Pressable>
    </BlurView>
  );
};

const stylesheet = createStyleSheet((theme) => {
  const size = Dimensions.get("window").width / 2.4; // maybe this is repsonsive between screen sizes??
  return {
    container: {
      borderRadius: theme.spacing.xs,
      overflow: "hidden",
      paddingVertical: theme.spacing.sm,
      width: size,
    },
    inner: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      justifyContent: "center",
    },
    text: {
      color: "white",
    },
  };
});
