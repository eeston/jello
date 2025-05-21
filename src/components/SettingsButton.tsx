import { HeaderButton } from "@react-navigation/elements";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useStyles } from "react-native-unistyles";

export const SettingsButton = () => {
  const { theme } = useStyles();
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
