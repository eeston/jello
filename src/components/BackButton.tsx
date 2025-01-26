import { useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable } from "react-native";

export const BackButton = () => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={navigation.goBack}>
      <SymbolView
        name="chevron.left"
        resizeMode="scaleAspectFit"
        tintColor="white"
      />
    </Pressable>
  );
};
