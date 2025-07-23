import { HeaderButton } from "@react-navigation/elements";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useUnistyles } from "react-native-unistyles";

export const SettingsButton = () => {
  const { theme } = useUnistyles();
  // TODO: add profile initials
  return (
    <Link asChild href="/modal">
      <HeaderButton>
        <SymbolView
          name="person.crop.circle"
          resizeMode="scaleAspectFit"
          tintColor={theme.colors.tint}
        />
      </HeaderButton>
    </Link>
  );
};
