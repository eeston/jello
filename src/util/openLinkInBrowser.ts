import { Linking } from "react-native";

export const openLinkInBrowser = async (url: string) => {
  return Linking.canOpenURL(url).then(
    (canOpen) => canOpen && Linking.openURL(url),
  );
};
