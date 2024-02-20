import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Image } from "expo-image";
import { View } from "react-native";
import { useStyles, createStyleSheet } from "react-native-unistyles";

import { useFetchUser } from "../../api/user";
import { usePlayTracks } from "../../hooks/usePlayTracks";
import { useApi } from "../../store/useJelloAuth";
import { extractPrimaryHash } from "../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../util/generateTrackArtworkUrl";
import { MusicButton } from "../MusicButton";
import { Separator } from "../Separator";
import { Text } from "../Themed";

export const AlbumHeader = ({
  albumDetails,
  albumSongs,
}: {
  albumDetails: BaseItemDto;
  albumSongs: BaseItemDto[];
}) => {
  const { styles } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const user = useFetchUser(api);
  const playTracks = usePlayTracks();

  const onPressPlayAlbum = () => {
    playTracks({ tracks: albumSongs, api, userId: user.data?.Id });
  };

  const onPressShuffleAlbum = () => {
    playTracks({
      tracks: albumSongs,
      api,
      userId: user.data?.Id,
      shuffle: true,
    });
  };

  return (
    <View>
      <View style={styles.artworkContainer}>
        <Image
          style={styles.artwork}
          source={generateTrackArtworkUrl({ id: albumDetails?.Id, api })}
          placeholder={extractPrimaryHash(albumDetails?.ImageBlurHashes)}
          contentFit="cover"
          transition={300}
        />
        <Text style={styles.albumTitle}>{albumDetails?.Name}</Text>
        <Text style={styles.albumArtist}>{albumDetails?.AlbumArtist}</Text>
        <Text style={styles.albumYear}>
          {!!albumDetails?.Genres?.length &&
            `${albumDetails?.Genres?.map((genre) => genre).join(", ")} • `}
          {albumDetails?.ProductionYear}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <MusicButton onPress={onPressPlayAlbum} type="play" />
        <MusicButton onPress={onPressShuffleAlbum} type="shuffle" />
      </View>
      <Separator marginLeft={20} />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  artworkContainer: { alignItems: "center" },
  artwork: {
    borderRadius: theme.spacing.md,
    height: 250,
    width: 250,
  },
  albumTitle: {
    fontSize: 20,
    paddingTop: theme.spacing.md,
    fontWeight: "500",
  },
  albumArtist: {
    color: theme.colors.primary,
    paddingTop: theme.spacing.xxs,
    fontSize: 16,
  },
  albumYear: {
    paddingHorizontal: theme.spacing.md,
    textAlign: "center",
    fontSize: 10,
    paddingTop: theme.spacing.xxs,
    fontWeight: "bold",
    color: "grey",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
    paddingVertical: theme.spacing.md,
  },
}));
