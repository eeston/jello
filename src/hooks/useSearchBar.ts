import { NavigationProp } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native";

type SearchBarOptions = {
  placeholder: string;
  navigation: NavigationProp<any>;
  onChangeText: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
};

export const useSearchBar = ({
  navigation,
  onChangeText,
  placeholder,
}: SearchBarOptions) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder,
        hideWhenScrolling: false,
        autoCapitalize: "none",
        onChangeText,
      },
    });
  }, [navigation, onChangeText, placeholder]);
};
