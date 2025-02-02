import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const RightChevron = () => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <SymbolView
        name="chevron.right"
        resizeMode="scaleAspectFit"
        size={14}
        tintColor={theme.colors.secondary}
        weight="light"
      />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    justifyContent: "center",
  },
}));
