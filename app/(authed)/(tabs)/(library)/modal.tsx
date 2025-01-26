import { useFetchUser } from "@src/api/useFetchUser";
import { useSignOut } from "@src/api/useSignOut";
import { Button } from "@src/components/Button";
import { ListPadding } from "@src/components/ListPadding";
import { TextGroup } from "@src/components/TextGroup";
import { ThemedText } from "@src/components/ThemedText";
import { useAuth } from "@src/store/AuthContext";
import { openLinkInBrowser } from "@src/util/openLinkInBrowser";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Modal() {
  const { api } = useAuth();
  const user = useFetchUser(api);
  const queryClient = useQueryClient();
  const { styles } = useStyles(stylesheet);
  const signOut = useSignOut();

  const handleOnPressSource = () => {
    return openLinkInBrowser("https://github.com/eeston/Jello");
  };
  const handleOnPressReview = () => {
    // TODO
    // return openLinkInBrowser("REVIEW_LINK");
  };

  useEffect(() => {
    if (signOut.isSuccess) {
      queryClient.clear();
    }
  }, [signOut.isSuccess]);

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <View>
        <ThemedText style={styles.text}>User</ThemedText>
        <TextGroup
          rows={[
            { leftText: "Username", rightText: user?.data?.Name ?? "Unknonw" },
            { leftText: "ID", rightText: user?.data?.Id },
          ]}
        />
      </View>
      <View>
        <ThemedText style={styles.text}>Client</ThemedText>
        <TextGroup
          rows={[
            { leftText: "Version", rightText: api?.clientInfo?.version },
            {
              leftText: "Source",
              onPress: handleOnPressSource,
              rightText: "https://github.com/eeston/Jello",
            },
            {
              leftText: "Review",
              onPress: handleOnPressReview,
              rightText: "app store link when released",
            },
          ]}
        />
      </View>
      <View>
        <ThemedText style={styles.text}>Server</ThemedText>
        <TextGroup rows={[{ leftText: "Host", rightText: api?.basePath }]} />
      </View>

      <Button
        isLoading={signOut.isPending}
        onPress={signOut.mutate}
        title="Sign Out"
      />

      <ListPadding />
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  button: { width: "100%" },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: theme.spacing.md,
  },
  listItem: {
    fontSize: 20,
    fontWeight: "400",
  },
  text: {
    fontSize: 14,
    paddingBottom: theme.spacing.xxxs,
    paddingHorizontal: theme.spacing.sm,
  },
}));
