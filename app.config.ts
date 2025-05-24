import { ConfigContext, ExpoConfig } from "expo/config";

import { name, version } from "./package.json";

export default (_: ConfigContext): ExpoConfig => ({
  assetBundlePatterns: ["**/*"],
  experiments: {
    reactCompiler: true,
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "d948484f-3720-473b-ad8d-5efe058b766c",
    },
  },
  ios: {
    bundleIdentifier: "dev.easton.jello",
    config: {
      usesNonExemptEncryption: false,
    },
    icon: {
      dark: "./assets/images/ios-dark.png",
      light: "./assets/images/ios-light.png",
      tinted: "./assets/images/ios-tinted.png",
    },
    infoPlist: {
      UIBackgroundModes: ["audio"],
    },
    splash: {
      // resizeMode: "contain",
      backgroundColor: "#FFFFFF",
      dark: {
        // resizeMode: "contain",
        backgroundColor: "#000000",
        image: "./assets/images/splash.png",
      },
      image: "./assets/images/splash.png",
    },
    supportsTablet: false,
    // backgroundColor: "#000000",
  },
  name: "Jello",
  newArchEnabled: false, // https://github.com/doublesymmetry/react-native-track-player/pull/2395
  orientation: "portrait",
  platforms: ["ios"],
  plugins: ["expo-secure-store", "expo-router", "expo-build-properties"],
  scheme: name,
  slug: name,
  userInterfaceStyle: "light",
  version,
});
