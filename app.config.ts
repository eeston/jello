import { ConfigContext, ExpoConfig } from "expo/config";

import { name, version } from "./package.json";

export default (_: ConfigContext): ExpoConfig => ({
  name: "Jello",
  slug: name,
  scheme: name,
  version,
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  platforms: ["ios"],
  ios: {
    icon: "./assets/images/icon.png",
    supportsTablet: false,
    infoPlist: {
      UIBackgroundModes: ["audio"],
    },
    bundleIdentifier: "dev.easton.jello",
    config: {
      usesNonExemptEncryption: false,
    },
    splash: {
      // image: "./assets/images/splash.png",
      // resizeMode: "contain",
      backgroundColor: "#FFFFFF",
      dark: {
        // image: "./assets/images/splash.png",
        // resizeMode: "contain",
        backgroundColor: "#000000",
      },
    },
    // backgroundColor: "#000000",
  },
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "13.4", // sync expo-secure-store
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "d948484f-3720-473b-ad8d-5efe058b766c",
    },
  },
});
