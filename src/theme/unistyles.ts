import { StyleSheet } from "react-native-unistyles";

import darkTheme from "./dark";
import lightTheme from "./light";

const appThemes = {
  dark: darkTheme,
  light: lightTheme,
};

const breakpoints = {
  lg: 800,
  md: 500,
  sm: 300,
  xl: 1200,
  xs: 0,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  settings: {
    initialTheme: "light",
  },
  themes: appThemes,
});

// import { StyleSheet } from "react-native-unistyles";

// import darkTheme from "./dark";
// import lightTheme from "./light";

// // if you defined themes
// type AppThemes = {
//   dark: typeof darkTheme;
//   light: typeof lightTheme;
// };

// // override library types
// declare module "react-native-unistyles" {
//   export interface UnistylesThemes extends AppThemes {}
// }

// UnistylesRegistry.addThemes({
//   dark: darkTheme,
//   light: lightTheme,
//   // register other themes with unique names
// }).addConfig({
//   // you can pass here optional config described below
//   adaptiveThemes: true,
// });
