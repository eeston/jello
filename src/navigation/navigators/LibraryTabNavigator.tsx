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
import {
  AlbumsListScreen,
  ArtistDetailsScreen,
  ArtistsListScreen,
  LibraryDetailsScreen,
  PlaylistDetailsScreen,
  PlaylistsListScreen,
  GenresListScreen,
  GenreDetailsScreen,
} from "../screens/LibraryTab";

export type LibraryTabParamList = {
  LibraryDetails: undefined;
  PlaylistsList: undefined;
  PlaylistDetails: { playlistId: string };
  ArtistsList: undefined;
  ArtistDetails: { artistId: string };
  AlbumsList: undefined;
  AlbumDetails: { albumId: string };
  GenresList: undefined;
  GenreDetails: { genreId: string; genreName: string };
  SettingsModal: undefined;
  NowPlayingModal: undefined;
};
type Props = NativeStackScreenProps<LibraryTabParamList>;

const LibraryTab = createNativeStackNavigator<LibraryTabParamList>();
export type LibraryTabStackType = typeof LibraryTab;

export const LibraryTabNavigator = ({ navigation }: Props) => {
  const { theme } = useStyles(stylesheet);

  const onPressSettings = () => {
    return navigation.navigate("SettingsModal");
  };

  return (
    <LibraryTab.Navigator initialRouteName="LibraryDetails">
      <LibraryTab.Screen
        name="LibraryDetails"
        component={LibraryDetailsScreen}
        options={{
          headerTitle: "Library",
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
      <LibraryTab.Screen
        name="PlaylistsList"
        component={PlaylistsListScreen}
        options={{
          headerTitle: "Playlists",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      <LibraryTab.Screen
        name="PlaylistDetails"
        component={PlaylistDetailsScreen}
        options={{
          // headerTitle: "Playlists", playlist name after scroll
          headerTitle: "",
          headerTransparent: true,
          headerBlurEffect: UnistylesRuntime.themeName,
        }}
      />
      <LibraryTab.Screen
        name="ArtistsList"
        component={ArtistsListScreen}
        options={{
          headerTitle: "Artists",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      <LibraryTab.Screen
        name="ArtistDetails"
        component={ArtistDetailsScreen}
        options={{
          // headerTitle: "Artist", playlist name after scroll
          headerTitle: "",
          headerTransparent: true,
          headerBlurEffect: UnistylesRuntime.themeName,
        }}
      />
      <LibraryTab.Screen
        name="AlbumsList"
        component={AlbumsListScreen}
        options={{
          headerTitle: "Albums",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      <LibraryTab.Screen
        name="GenresList"
        component={GenresListScreen}
        options={{
          headerTitle: "Genres",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: UnistylesRuntime.themeName,
          headerLargeStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
      <LibraryTab.Screen
        name="GenreDetails"
        component={GenreDetailsScreen}
        options={({ route }) => ({
          headerTitle: route.params.genreName,
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: UnistylesRuntime.themeName,
        })}
      />
      {commonScreens({ Stack: LibraryTab })}
    </LibraryTab.Navigator>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  //
}));
