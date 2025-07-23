import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export const RightChevron = () => {
  const { theme } = useUnistyles();

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

const styles = StyleSheet.create((theme) => ({
  container: {
    justifyContent: "center",
  },
}));
