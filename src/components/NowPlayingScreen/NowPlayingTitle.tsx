import { ThemedText } from "@src/components/ThemedText";
import { SymbolView } from "expo-symbols";
import { TouchableOpacity, View } from "react-native";
import { TrackMetadataBase } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const NowPlayingTitle = ({
  artist,
  id,
  isFavourite,
  title,
}: {
  artist: TrackMetadataBase["artist"];
  id: TrackMetadataBase["id"];
  isFavourite: TrackMetadataBase["isFavourite"];
  title: TrackMetadataBase["title"];
}) => {
  const { styles, theme } = useStyles(stylesheet);
  // const { api } = useAuth();
  // const toggleFavouriteTrack = useToggleFavouriteTrack();

  // const handleOnPressFavourite = async () => {
  //   await TrackPlayer.updateMetadataForTrack(1, {
  //     // isFavorite: true,
  //     rating: RatingType.Heart,
  //   });
  //   toggleFavouriteTrack.mutate({
  //     id,
  //     api,
  //     isFavourite,
  //   });
  // };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <ThemedText
          numberOfLines={1}
          style={{ color: "white" }}
          type="subtitle"
        >
          {title ?? "Unknown Track"}
        </ThemedText>
        <ThemedText
          style={{ color: "rgba(255, 255, 255, 0.4)" }}
          type="defaultSemiBold"
        >
          {artist ?? "Unknown Artist"}
        </ThemedText>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          // onPress={handleOnPressFavourite}
          style={{
            backgroundColor: theme.colors.translucent,
            borderRadius: theme.spacing.md,
            marginLeft: theme.spacing.sm,
            padding: theme.spacing.xxs,
          }}
        >
          <SymbolView
            // name="star"
            name={isFavourite ? "star.fill" : "star"}
            resizeMode="scaleAspectFit"
            size={20}
            tintColor="white"
            weight="heavy"
          />
        </TouchableOpacity>

        <TouchableOpacity
          // onPress={() => Alert.alert("TODO...")}
          style={{
            backgroundColor: theme.colors.translucent,
            borderRadius: theme.spacing.md,
            marginLeft: theme.spacing.sm,
            padding: theme.spacing.xxs,
          }}
        >
          <SymbolView
            name="ellipsis"
            resizeMode="scaleAspectFit"
            size={20}
            tintColor="white"
            weight="heavy"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    width: "100%",
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
    marginRight: theme.spacing.md,
  },
}));
