import { ThemedText } from "@src/components/ThemedText";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function NoSearchResults({
  query,
  type,
}: {
  query?: string;
  type: "Albums" | "Artists" | "Genres" | "Playlists";
}) {
  const { styles, theme } = useStyles(stylesheet);

  if (query) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={styles.queryText}>No {type} Available</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SymbolView
          name="magnifyingglass"
          resizeMode="scaleAspectFit"
          size={64}
          style={styles.icon}
          tintColor={theme.colors.secondary}
        />
        <ThemedText style={styles.queryText}>
          No results for "{query}"
        </ThemedText>
        <ThemedText style={styles.helpText}>
          Check the spelling or try a new search.
        </ThemedText>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  content: {
    alignItems: "center",
    marginTop: "50%",
    paddingHorizontal: theme.spacing.lg,
  },
  helpText: {
    color: theme.colors.secondary,
    fontSize: 15,
    textAlign: "center",
  },
  icon: {
    marginBottom: theme.spacing.md,
  },
  queryText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
}));
