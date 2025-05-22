import { useVolume } from "@src/hooks/useVolume";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingVolume = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { updateVolume, volume } = useVolume();

  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  progress.value = volume ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.iconLeft}>
        <SymbolView
          name="speaker.fill"
          resizeMode="scaleAspectFit"
          size={theme.symbol.xs}
          tintColor="#ffffff6a"
        />
      </View>
      <View style={styles.silderContainer}>
        <Slider
          containerStyle={styles.sliderContainerStyle}
          maximumValue={max}
          minimumValue={min}
          onValueChange={(value) => {
            updateVolume(value);
          }}
          progress={progress}
          renderBubble={() => null}
          theme={{
            maximumTrackTintColor: "rgba(255, 255, 255, 0.3)",
            minimumTrackTintColor: "rgba(255, 255, 255, 0.5)",
          }}
          thumbWidth={0}
        />
      </View>
      <View style={styles.iconRight}>
        <SymbolView
          name="speaker.wave.3.fill"
          resizeMode="scaleAspectFit"
          size={theme.symbol.sm}
          tintColor="#ffffff6a"
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: theme.spacing.xl,
    width: "100%",
  },
  iconLeft: { paddingRight: theme.spacing.xs },
  iconRight: { paddingLeft: theme.spacing.xs },
  silderContainer: { flex: 1, paddingHorizontal: theme.spacing.sm },
  sliderContainerStyle: {
    borderRadius: 6,
    height: 6,
  },
}));
