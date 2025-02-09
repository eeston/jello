import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const BACK_BUTTON_WORKAROUND: Pick<
  NativeStackNavigationOptions,
  "headerBackButtonDisplayMode" | "headerBackTitle" | "headerBackTitleStyle"
> = {
  // we just want to use headerBackButtonDisplayMode here but it's currently broken
  // https://github.com/react-navigation/react-navigation/issues/11946#issuecomment-2506102387
  // headerBackButtonDisplayMode: "minimal",
  // TODO: workaround...
  headerBackButtonDisplayMode: "default",
  headerBackTitle: ".",
  headerBackTitleStyle: { fontSize: 1 },
};
