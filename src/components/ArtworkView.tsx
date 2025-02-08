import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const HEADER_HEIGHT = Dimensions.get("window").width;
export const ArtworkView = ({}) => {
  const { styles } = useStyles(stylesheet);

  return (
    <ScrollView style={styles.container}>
      {/* <ArtworkViewHeader
        albumArtistName={"test"}
        albumGenres={["test"]}
        albumName={"test"}
        albumProductionYear={"test"}
        artworkBlurhash={"test"}
        artworkUrl={"test"}
        onPressPlayAlbum={"test"}
        onPressShuffleAlbum={"test"}
      />
      <View style={[styles.header]}>
        {headerImage}
        <View style={styles.blurContainer}>
          <BlurView style={StyleSheet.absoluteFill} tint="dark" />
          <View style={styles.overlayContent}>{headerOverlay}</View>
        </View>
      </View> */}
    </ScrollView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  blurContainer: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 2,
  },
  container: {
    flex: 1,
  },
  content: {
    // paddingHorizontal: theme.spacing.md,
    // overflow: "hidden",
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  overlayContent: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 3,
  },
  scrollContent: {
    paddingTop: 0,
  },
}));
