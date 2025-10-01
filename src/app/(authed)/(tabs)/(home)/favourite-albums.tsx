import { ThemedText } from "@src/components/ThemedText";
import { ScrollView } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function RecentlyPlayed() {
  // TODO: some copy for an empty screen?

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      // refreshControl={
      // <RefreshControl onRefresh={handleOnRefresh} refreshing={isRefreshing} />
      // }
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText>favourite albums</ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    //
  },
}));
