import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Image } from "expo-image";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchUser } from "../../api/user";
import { usePlayTracks } from "../../hooks/usePlayTracks";
import { useApi } from "../../store/useJelloAuth";
import { extractPrimaryHash } from "../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../util/generateTrackArtworkUrl";
import { MusicButton } from "../MusicButton";
import { Text } from "../Themed";

type ArtistHeaderProps = {
  artistDetails: BaseItemDto;
  artistSongs: BaseItemDto[];
};

export const ArtistHeader = ({
  artistDetails,
  artistSongs,
}: ArtistHeaderProps) => {
  const { styles } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const playTracks = usePlayTracks();
  const user = useFetchUser(api);

  const onPressPlayArtist = () => {
    playTracks({ tracks: artistSongs, api, userId: user.data?.Id });
  };

  const onPressShuffleArtist = () => {
    playTracks({
      tracks: artistSongs,
      api,
      userId: user.data?.Id,
      shuffle: true,
    });
  };

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
        <MusicButton onPress={onPressPlayArtist} type="play" />
        <MusicButton onPress={onPressShuffleArtist} type="shuffle" />
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
