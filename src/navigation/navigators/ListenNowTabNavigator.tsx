import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import * as React from "react";
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from "react-native-unistyles";

import { commonScreens } from "./common";
import { PressableSFSymbol } from "../../components/PressableSFSymbol";
import { ListenNowScreen } from "../screens/ListenNowTab";

type ListenNowTabParamList = {
  ListenNowDetails: undefined;
  AlbumDetails: { albumId: string };
  SettingsModal: undefined;
  NowPlayingModal: undefined;
};
type Props = NativeStackScreenProps<ListenNowTabParamList>;

const ListenNowTab = createNativeStackNavigator<ListenNowTabParamList>();
export type ListenNowTabStack = typeof ListenNowTab;

export const ListenNowTabNavigator = ({ navigation }: Props) => {
  const { theme } = useStyles(stylesheet);

  const onPressSettings = () => {
    return navigation.navigate("SettingsModal");
  };

  return (
    <ListenNowTab.Navigator>
      <ListenNowTab.Screen
        name="ListenNowDetails"
        component={ListenNowScreen}
        options={{
          headerTitle: "Listen Now",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeStyle: {
            backgroundColor: theme.colors.background,
          },
          headerRight: () => (
            <PressableSFSymbol
              name="person.crop.circle"
              onPress={onPressSettings}
              color={theme.colors.primary}
              size={28}
            />
          ),
        }}
      />
      {commonScreens({ Stack: ListenNowTab })}
    </ListenNowTab.Navigator>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  //
}));
