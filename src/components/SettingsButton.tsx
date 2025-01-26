import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable } from "react-native";
import { useStyles } from "react-native-unistyles";

export const SettingsButton = () => {
  const { theme } = useStyles();
  // TODO: add profile initials
  return (
    <Link asChild href="/modal">
      <Pressable>
        <SymbolView
          name="person.crop.circle"
          resizeMode="scaleAspectFit"
          tintColor={theme.colors.tint}
        />
      </Pressable>
    </Link>
  );
};
