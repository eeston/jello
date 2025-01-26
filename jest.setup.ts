import { NativeModules } from "react-native";

NativeModules.Unistyles = {
  install: jest.fn().mockReturnValue(true),
};

global.__UNISTYLES__ = {
  enabledPlugins: [],
  themeName: "light",
  useAdaptiveThemes: jest.fn(),
  useBreakpoints: jest.fn(),
  useTheme: jest.fn(),
};
