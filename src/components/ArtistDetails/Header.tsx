import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Image } from "expo-image";
import { View } from "react-native";
import { useStyles, createStyleSheet } from "react-native-unistyles";

import { useApi } from "../../store/useJelloAuth";
import { extractPrimaryHash } from "../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../util/generateTrackArtworkUrl";
import { Text } from "../Themed";

export const ArtistHeader = ({
  artistDetails,
}: {
  artistDetails: BaseItemDto;
}) => {
  const { styles } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  return (
    <View>
      <View style={styles.headerImageContainer}>
        <Image
          style={styles.headerImage}
          source={generateTrackArtworkUrl({ id: artistDetails?.Id, api })}
          placeholder={extractPrimaryHash(artistDetails?.ImageBlurHashes)}
          contentFit="cover"
          transition={300}
        />
        <Text style={styles.headerTitle}>{artistDetails?.Name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {/* <MusicButton type="play" />
          <MusicButton type="shuffle" /> */}
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  headerImageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerImage: {
    flex: 1,
    borderRadius: theme.spacing.xxl * 2,
    height: theme.spacing.xxl * 2,
    width: theme.spacing.xxl * 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: theme.spacing.sm,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    paddingVertical: theme.spacing.sm,
  },
}));
