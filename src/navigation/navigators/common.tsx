import { UnistylesRuntime } from "react-native-unistyles";

import { LibraryTabStackType } from "./LibraryTabNavigator";
import { AlbumDetailsScreen } from "../screens/LibraryTab";
import { NowPlayingModal, SettingsModal } from "../screens/Modals";
// import { ListenNowTabStack } from "../navigators/ListenNowTabNavigator";

type Props = {
  Stack: LibraryTabStackType; // | ListenNowTabStack;
};

export const commonScreens = ({ Stack }: Props) => {
  return (
    <>
      <Stack.Screen
        name="AlbumDetails"
        component={AlbumDetailsScreen}
        options={{
          // headerTitle: "", Album name after scroll
          headerTitle: "",
          headerTransparent: true,
          headerBlurEffect: UnistylesRuntime.themeName,
        }}
      />
      <Stack.Group
        screenOptions={{
          // TODO: how to use this with gestures (drag down to dismiss)
          // presentation: "fullScreenModal",
          presentation: "modal",
        }}
      >
        <Stack.Screen
          name="SettingsModal"
          component={SettingsModal}
          options={{
            headerTitle: "Settings",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="NowPlayingModal"
          component={NowPlayingModal}
          options={{
            headerTitle: "",
            headerLargeTitle: true,
            headerTransparent: true,
          }}
        />
      </Stack.Group>
    </>
  );
};
