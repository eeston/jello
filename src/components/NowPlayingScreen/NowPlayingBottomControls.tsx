import { ExpoAvRoutePickerView } from "@douglowder/expo-av-route-picker-view";
import { SymbolView } from "expo-symbols";
import { Alert, Pressable, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingBottomControls = () => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => Alert.alert("TODO...")}>
        <SymbolView
          name="quote.bubble"
          resizeMode="scaleAspectFit"
          size={theme.symbol.md}
          tintColor="#ffffff6a"
        />
      </Pressable>
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
            height: 150,
            width: 150,
          }}
          tintColor="#ffffff6a"
        />
      </View>
      <Pressable onPress={() => Alert.alert("TODO...")}>
        <SymbolView
          name="list.bullet"
          resizeMode="scaleAspectFit"
          size={theme.symbol.md}
          tintColor="#ffffff6a"
        />
      </Pressable>
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
