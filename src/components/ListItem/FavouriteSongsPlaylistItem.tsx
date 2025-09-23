import { RightChevron } from "@src/components/RightChevron";
import { ThemedText } from "@src/components/ThemedText";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export const FavouriteSongsPlaylistItem = () => {
  const { theme } = useUnistyles();

  return (
    <Link
      asChild
      href={{
        pathname: "/playlists/favourite-songs",
      }}
    >
      <TouchableOpacity style={styles.container}>
        <View style={styles.leftContainer}>
          <View style={styles.artworkContainer}>
            <SymbolView
              name="star.fill"
              resizeMode="scaleAspectFit"
              size={50}
              tintColor={theme.colors.tint}
            />
          </View>
          <ThemedText>Favourite Songs</ThemedText>
        </View>
        <RightChevron />
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create((theme) => {
  return {
    artworkContainer: {
      alignItems: "center",
      backgroundColor: theme.colors.translucent,
      borderRadius: theme.spacing.xs,
      height: 80,
      justifyContent: "center",
      marginRight: theme.spacing.md,
      width: 80,
    },
    container: { flexDirection: "row", justifyContent: "space-between" },
    leftContainer: { alignItems: "center", flexDirection: "row" },
  };
});
