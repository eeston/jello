import { ThemedText } from "@src/components/ThemedText";
import * as Haptics from "expo-haptics";
import { SFSymbol, SymbolView } from "expo-symbols";
import { Dimensions, Pressable, View } from "react-native";
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

export const MusicButton = ({
  onPress,
  type,
}: {
  onPress: () => void;
  type: "play" | "shuffle";
}) => {
  const { styles, theme } = useStyles(stylesheet);

  const handleOnPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleOnPress}
        style={({ pressed }) => [styles.inner, { opacity: pressed ? 0.5 : 1 }]}
      >
        <SymbolView
          name={buttonTypes[type].icon}
          resizeMode="scaleAspectFit"
          size={18}
          tintColor={theme.colors.tint}
        />
        <ThemedText style={styles.text} type="defaultSemiBold">
          {buttonTypes[type].title}
        </ThemedText>
      </Pressable>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => {
  const size = Dimensions.get("window").width / 2.4; // maybe this is repsonsive between screen sizes??
  return {
    container: {
      backgroundColor: theme.colors.translucent,
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
      color: theme.colors.tint,
    },
  };
});
