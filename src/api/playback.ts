import { PlayMethod } from "@jellyfin/sdk/lib/generated-client";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api/playstate-api";
import TrackPlayer from "react-native-track-player";

import { useApi } from "../store/useJelloAuth";
import { secondsToTicks } from "../util/time";

export const syncPlaybackStart = async () => {
  const currentTrack = await TrackPlayer.getActiveTrack();
  const api = useApi.getState().api;
  const userId = new URL(currentTrack.url).searchParams.get("userId");

  await getPlaystateApi(api).onPlaybackStart({
    userId,
    itemId: currentTrack?.id,
    mediaSourceId: currentTrack?.id,
    playMethod: PlayMethod.Transcode,
  });
};

export const syncPlaybackProgress = async () => {
  const [currentTrack, position] = await Promise.all([
    TrackPlayer.getActiveTrack(),
    TrackPlayer.getPosition(),
  ]);
  const api = useApi.getState().api;
  const userId = new URL(currentTrack.url).searchParams.get("userId");

  await getPlaystateApi(api).onPlaybackProgress({
    userId,
    itemId: currentTrack?.id,
    mediaSourceId: currentTrack?.id,
    playMethod: PlayMethod.Transcode,
    positionTicks: secondsToTicks(position),
  });
};
