import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { StyleSheet } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import { useStyles } from "react-native-unistyles";

export default function TabLayout() {
  const { theme } = useStyles();
  return (
    <Tabs
      screenOptions={{
        animation: "fade",
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tint,
        tabBarBackground: CustomTabBarBackground,
        tabBarStyle: {
          borderTopWidth: 0,
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ focused }) => (
            <SymbolView
              name="house.fill"
              resizeMode="scaleAspectFit"
              tintColor={focused ? theme.colors.tint : "grey"}
            />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="(radio)"
        options={{
          tabBarIcon: ({ focused }) => (
            <SymbolView
              name="dot.radiowaves.left.and.right"
              resizeMode="scaleAspectFit"
              tintColor={focused ? theme.colors.tint : "grey"}
            />
          ),
          title: "Radio",
        }}
      />
      <Tabs.Screen
        name="(library)"
        options={{
          tabBarIcon: ({ focused }) => (
            <SymbolView
              name="play.square.stack.fill" // TODO: this icon isn't quite right
              resizeMode="scaleAspectFit"
              tintColor={focused ? theme.colors.tint : "grey"}
            />
          ),
          title: "Library",
        }}
      />
    </Tabs>
  );
}

const CustomTabBarBackground = () => {
  const { colors, locations } = easeGradient({
    colorStops: {
      0: { color: "transparent" },
      0.5: { color: "rgba(0,0,0,0.99)" },
      1: { color: "black" },
    },
  });

  return (
    <MaskedView
      maskElement={
        <LinearGradient
          colors={colors}
          locations={locations}
          style={StyleSheet.absoluteFillObject}
        />
      }
      style={[StyleSheet.absoluteFillObject, { marginTop: -100 }]}
    >
      <BlurView
        intensity={100}
        style={StyleSheet.absoluteFillObject}
        tint="prominent"
      />
    </MaskedView>
  );
};
