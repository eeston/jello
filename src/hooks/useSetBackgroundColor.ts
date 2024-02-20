import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { UnistylesRuntime } from "react-native-unistyles";

export const useSetBackgroundColor = (): void => {
  useEffect(() => {
    if (UnistylesRuntime.themeName === "dark") {
      SystemUI.setBackgroundColorAsync("#000000");
    } else {
      SystemUI.setBackgroundColorAsync("#FFFFFF");
    }
  }, [UnistylesRuntime.themeName]);
};
