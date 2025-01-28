import * as Haptics from "expo-haptics";

export async function vibrateLight() {
  if (__DEV__) {
    // no vibrations in simulator :(
    console.log("VIBRATE_LIGHT");
  }
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
