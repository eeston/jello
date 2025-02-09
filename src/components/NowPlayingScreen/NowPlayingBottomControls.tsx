import { ExpoAvRoutePickerView } from "@douglowder/expo-av-route-picker-view";
import { SymbolView } from "expo-symbols";
import { TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingBottomControls = () => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        // onPress={() => Alert.alert("TODO...")}
        // TODO: some weird hackery because ExpoAvRoutePickerView is the thief of screen space
        style={{ zIndex: 10 }}
      >
        <SymbolView
          name="quote.bubble"
          resizeMode="scaleAspectFit"
          size={theme.symbol.sm}
          tintColor="#ffffff6a"
        />
      </TouchableOpacity>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          position: "absolute",
          right: 0,
        }}
      >
        <ExpoAvRoutePickerView
          activeTintColor="white"
          prioritizesVideoDevices={false}
          style={{
            height: 130,
            width: 130,
            zIndex: -10,
          }}
          tintColor="#ffffff6a"
        />
      </View>
      <TouchableOpacity
      // onPress={() => Alert.alert("TODO...")}
      >
        <SymbolView
          name="list.bullet"
          resizeMode="scaleAspectFit"
          size={theme.symbol.sm}
          tintColor="#ffffff6a"
        />
      </TouchableOpacity>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xxl,
    width: "100%",
  },
}));
