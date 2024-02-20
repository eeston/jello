import {
  BottomTabBar,
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SFSymbol } from "react-native-sfsymbols";
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from "react-native-unistyles";

import { LibraryTabNavigator } from "./LibraryTabNavigator";
import { ListenNowTabNavigator } from "./ListenNowTabNavigator";

export type AppNavParamList = {
  ListenNowTab: undefined;
  LibraryTab: undefined;
};
type Props = BottomTabScreenProps<AppNavParamList>;

const AppTab = createBottomTabNavigator();

export const AppNavigator = (_: Props) => {
  const { theme } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();

  return (
    <AppTab.Navigator
      initialRouteName="ListenNowTab"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
        },
        headerShown: false,
        headerTitle: "Library",
      }}
      tabBar={(props) => (
        <BlurView
          style={{
            // TODO: eugh
            paddingTop: bottom + (bottom === 0 ? 47 : 17),
            height: bottom + (bottom === 0 ? 96 : 96),
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
          tint={UnistylesRuntime.themeName}
          intensity={90}
        >
          <BottomTabBar {...props} />
        </BlurView>
      )}
    >
      <AppTab.Screen
        name="ListenNowTab"
        component={ListenNowTabNavigator}
        options={{
          headerTransparent: true,
          // headerLargeTitle: true, // not on tabs?
          // headerTitle: "Listen Now",
          headerShown: false,
          tabBarLabel: "Listen Now",
          tabBarIcon: ({ focused }) => (
            <SFSymbol
              name="play.circle.fill"
              size={24}
              resizeMode="center"
              color={focused ? theme.colors.primary : "grey"}
            />
          ),
        }}
      />
      <AppTab.Screen
        name="LibraryTab"
        component={LibraryTabNavigator}
        options={{
          headerShown: false,
          tabBarLabel: "Library",
          tabBarIcon: ({ focused }) => (
            <SFSymbol
              // TODO: this icon is not correct
              name="music.note.house.fill"
              size={24}
              resizeMode="center"
              color={focused ? theme.colors.primary : "grey"}
            />
          ),
        }}
      />
    </AppTab.Navigator>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  //
}));
