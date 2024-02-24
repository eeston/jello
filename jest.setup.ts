import { NativeModules } from "react-native";

NativeModules.Unistyles = {
  install: jest.fn().mockReturnValue(true),
};

global.__UNISTYLES__ = {
  enabledPlugins: [],
  useBreakpoints: jest.fn(),
  useAdaptiveThemes: jest.fn(),
  useTheme: jest.fn(),
  themeName: "light",
};
