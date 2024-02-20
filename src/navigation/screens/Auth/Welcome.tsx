import { Image, SafeAreaView, View } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { PressableSFSymbol } from "../../../components/PressableSFSymbol";
import { Text } from "../../../components/Themed";

export const WelcomeScreen = ({ navigation }) => {
  const { styles, theme } = useStyles(stylesheet);

  const onPressButton = () => {
    return navigation.navigate("Server");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Image
          source={require("../../../../assets/images/icon.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Welcome to Jello</Text>
        <Text style={styles.subTitle}>
          Stream your Jellyfin music library on the move.
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        <SFSymbol
          name="backward.fill"
          color={theme.colors.textSecondary}
          size={32}
        />
        <PressableSFSymbol
          name="play.fill"
          onPress={onPressButton}
          color={theme.colors.text}
          size={50}
        />
        <SFSymbol
          name="forward.fill"
          color={theme.colors.textSecondary}
          size={32}
        />
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.bottomNote}>Press play to get started...</Text>
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    marginHorizontal: theme.spacing.lg,
  },
  sectionContainer: { marginVertical: theme.spacing.md },
  controlsContainer: {
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxxl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
    borderRadius: theme.spacing.md,
  },
  title: { textAlign: "center", fontWeight: "bold", fontSize: 28 },
  subTitle: { textAlign: "center", fontSize: 20, color: "grey" },
  bottomNote: { textAlign: "center", fontSize: 16, color: "grey" },
  noteContainer: {
    position: "absolute",
    width: "100%",
    bottom: theme.spacing.lg,
  },
}));
