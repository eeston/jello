import { ExpoAvRoutePickerView } from "@douglowder/expo-av-route-picker-view";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingBottomControls = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <ExpoAvRoutePickerView
        activeTintColor="white"
        prioritizesVideoDevices={false}
        style={{
          height: 150,
          width: 150,
        }}
        tintColor="white"
      />
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    alignItems: "center",
  },
}));
