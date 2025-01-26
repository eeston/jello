import { ThemedText } from "@src/components/ThemedText";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, SafeAreaView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Page() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.sectionContainer}>
        <ThemedText style={styles.text} type="title">
          Welcome to Jello
        </ThemedText>
        <ThemedText style={styles.text}>
          Stream your Jellyfin music library on the move.
        </ThemedText>
      </View>

      <View style={styles.controlsContainer}>
        <SymbolView
          name="backward.fill"
          resizeMode="scaleAspectFit"
          scale="small"
          tintColor={theme.colors.primary}
        />
        <Link asChild href="/server">
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
          >
            <SymbolView
              animationSpec={{ effect: { type: "scale" } }}
              name="play.fill"
              resizeMode="scaleAspectFit"
              scale="large"
              tintColor={theme.colors.primary}
            />
          </Pressable>
        </Link>
        <SymbolView
          name="forward.fill"
          resizeMode="scaleAspectFit"
          scale="small"
          tintColor={theme.colors.primary}
        />
      </View>

      <View style={styles.noteContainer}>
        <ThemedText style={styles.text}>
          Press play to get started...
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    marginHorizontal: theme.spacing.lg,
  },
  controlsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxxl,
  },
  image: {
    alignSelf: "center",
    borderRadius: theme.spacing.md,
    height: 300,
    width: 300,
  },
  noteContainer: {
    bottom: theme.spacing.lg,
    position: "absolute",
    width: "100%",
  },
  sectionContainer: { marginVertical: theme.spacing.md },
  text: { textAlign: "center" },
}));
