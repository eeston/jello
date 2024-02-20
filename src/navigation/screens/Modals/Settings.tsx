import { useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { SafeAreaView, ScrollView, View, Alert } from "react-native";
import TrackPlayer from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchCollections } from "../../../api/collection";
import { useFetchUser } from "../../../api/user";
import { Button } from "../../../components/Button";
import { TextGroup } from "../../../components/TextGroup";
import { Text } from "../../../components/Themed";
import {
  STORE_ACCESS_TOKEN_KEY,
  STORE_SELECTED_MUSIC_LIBRARY,
  STORE_SERVER_ADDRESS_KEY,
} from "../../../constants";
import { useApi, rmApi } from "../../../store/useJelloAuth";
import { openLinkInBrowser } from "../../../util/openLinkInBrowser";

export const SettingsModal = () => {
  const [isSigningOut, setSsSigningOut] = useState(false);
  const api = useApi((state) => state.api);
  const user = useFetchUser(api);
  const queryClient = useQueryClient();
  const { styles } = useStyles(stylesheet);
  const collections = useFetchCollections(api);
  const [libraryDetails, setLibraryDetails] = useState(
    JSON.parse(SecureStore.getItem(STORE_SELECTED_MUSIC_LIBRARY)),
  );

  const onPressSelectLibrary = () => {
    return Alert.alert(
      "Where would you like to stream your music from?",
      "",
      collections.data?.Items?.filter((i) => i.CollectionType === "music").map(
        (collection) => {
          return {
            text: collection.Name,
            onPress: () => {
              SecureStore.setItem(
                STORE_SELECTED_MUSIC_LIBRARY,
                JSON.stringify({
                  id: collection?.Id,
                  name: collection?.Name,
                }),
              );
              setLibraryDetails({
                id: collection?.Id,
                name: collection?.Name,
              });
              queryClient.invalidateQueries();
            },
          };
        },
      ),
    );
  };

  const onPressSignOut = async () => {
    setSsSigningOut(true);
    await TrackPlayer.reset();
    await queryClient.invalidateQueries();
    queryClient.clear();
    api?.logout();
    rmApi();
    await Promise.all([
      SecureStore.deleteItemAsync(STORE_ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(STORE_SERVER_ADDRESS_KEY),
      SecureStore.deleteItemAsync(STORE_SELECTED_MUSIC_LIBRARY),
    ]);
    setSsSigningOut(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.header}>User</Text>
          <TextGroup
            rows={[
              { leftText: "Username", rightText: user?.data?.Name },
              { leftText: "User ID", rightText: user?.data?.Id },
            ]}
          />
        </View>
        <View>
          <Text style={styles.header}>Client</Text>
          <TextGroup
            rows={[
              { leftText: "Name", rightText: api?.clientInfo?.name },
              { leftText: "Version", rightText: api?.clientInfo?.version },
              { leftText: "Device ID", rightText: api?.deviceInfo?.id },
            ]}
          />
        </View>
        <View>
          <Text style={styles.header}>Server</Text>
          <TextGroup rows={[{ leftText: "Host", rightText: api?.basePath }]} />
        </View>
        <View>
          <Text style={styles.header}>Library</Text>
          <TextGroup
            rows={[
              {
                leftText: "Name",
                rightText: collections.isPending
                  ? "Loading..."
                  : libraryDetails?.name,
                onPress:
                  (collections.data?.Items?.length ?? 0) > 1
                    ? onPressSelectLibrary
                    : undefined,
              },
            ]}
          />
        </View>
        <View style={{ paddingBottom: 100 }}>
          <Text style={styles.header}>Other</Text>
          <TextGroup
            rows={[
              {
                leftText: "Source",
                rightText: "https://github.com/eeston/Jello",
                onPress: () =>
                  openLinkInBrowser("https://github.com/eeston/Jello"),
              },
              { leftText: "Review", rightText: "app store link when released" },
            ]}
          />
          <Button
            onPress={onPressSignOut}
            title="Sign Out"
            isLoading={isSigningOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  listItem: {
    fontSize: 20,
    fontWeight: "400",
  },
  header: {
    fontWeight: "bold",
    padding: theme.spacing.xs,
  },
  button: { width: "100%" },
}));
