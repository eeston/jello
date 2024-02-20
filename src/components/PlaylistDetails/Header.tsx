import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { format } from "date-fns";
import { Image } from "expo-image";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchUser } from "../../api/user";
import { usePlayTracks } from "../../hooks/usePlayTracks";
import { useApi } from "../../store/useJelloAuth";
import { extractPrimaryHash } from "../../util/extractPrimaryHash";
import { generateTrackArtworkUrl } from "../../util/generateTrackArtworkUrl";
import { MusicButton } from "../MusicButton";
import { Separator } from "../Separator";
import { Text } from "../Themed";

export const PlaylistHeader = ({
  playlistDetails,
  playlistSongs,
}: {
  playlistDetails: BaseItemDto;
  playlistSongs: BaseItemDto[];
}) => {
  const { styles } = useStyles(stylesheet);
  const api = useApi((state) => state.api);
  const user = useFetchUser(api);
  const playTracks = usePlayTracks();

  const onPressPlayPlaylist = () => {
    playTracks({
      tracks: playlistSongs,
      api,
      userId: user.data?.Id,
    });
  };

  const onPressShufflePlaylist = () => {
    playTracks({
      tracks: playlistSongs,
      api,
      userId: user.data?.Id,
      shuffle: true,
    });
  };

  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={generateTrackArtworkUrl({ id: playlistDetails?.Id, api })}
          placeholder={extractPrimaryHash(playlistDetails?.ImageBlurHashes)}
          contentFit="cover"
          transition={300}
        />
        <Text style={styles.playlistName}>{playlistDetails?.Name}</Text>
        <Text style={styles.playlistDetails}>
          Created {format(new Date(playlistDetails?.DateCreated), `dd/MM/yyyy`)}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <MusicButton onPress={onPressPlayPlaylist} type="play" />
        <MusicButton onPress={onPressShufflePlaylist} type="shuffle" />
      </View>
      <Separator marginLeft={20} />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  imageContainer: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    borderRadius: theme.spacing.xs,
    height: 250,
    width: 250,
  },
  playlistName: {
    fontSize: 20,
    paddingTop: theme.spacing.lg,
    fontWeight: "500",
    textAlign: "center",
  },
  playlistDetails: {
    fontSize: 10,
    paddingTop: theme.spacing.xs,
    fontWeight: "bold",
    textAlign: "center",
    color: "grey",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    paddingVertical: theme.spacing.lg,
  },
}));
