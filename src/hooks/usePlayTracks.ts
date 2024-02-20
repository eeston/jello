import { Api } from "@jellyfin/sdk";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { useCallback } from "react";
import TrackPlayer from "react-native-track-player";

import { generateRntpTracks } from "../util/generateRntpTracks";
import { shuffleArray } from "../util/shuffleArray";

type PlayTracksProps = {
  tracks: BaseItemDto[];
  api: Api;
  userId: string;
  shuffle?: boolean;
  startingTrackId?: string;
  albumDetails?: BaseItemDto;
};

export const usePlayTracks = () => {
  const playTracks = useCallback(
    async ({
      tracks,
      api,
      userId,
      shuffle,
      startingTrackId,
      albumDetails,
    }: PlayTracksProps): Promise<void> => {
      const generatedTracks = await generateRntpTracks({
        tracks,
        api,
        userId,
        albumDetails,
      });

      if (shuffle) {
        await TrackPlayer.setQueue(shuffleArray(generatedTracks));
      } else {
        await TrackPlayer.setQueue(generatedTracks);
      }

      if (!shuffle && startingTrackId) {
        const index = generatedTracks.findIndex(
          (track) => track.id === startingTrackId,
        );

        if (!(index < 1)) {
          await TrackPlayer.skip(index);
        }
      }

      await TrackPlayer.play();
    },
    [],
  );

  return playTracks;
};
