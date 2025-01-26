import { UnistylesRegistry } from "react-native-unistyles";

import darkTheme from "./dark";
import lightTheme from "./light";

// if you defined themes
type AppThemes = {
  dark: typeof darkTheme;
  light: typeof lightTheme;
};

// override library types
declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addThemes({
  dark: darkTheme,
  light: lightTheme,
  // register other themes with unique names
}).addConfig({
  // you can pass here optional config described below
  adaptiveThemes: true,
});
