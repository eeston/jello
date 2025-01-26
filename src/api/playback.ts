import { PlayMethod } from "@jellyfin/sdk/lib/generated-client";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api/playstate-api";
import { apiService } from "@src/services/api";
import { secondsToTicks } from "@src/util/time";
import TrackPlayer from "react-native-track-player";

export const syncPlaybackStart = async () => {
  try {
    const activeTrack = await TrackPlayer.getActiveTrack();
    const api = apiService.getApi();

    if (!activeTrack?.url || !api) {
      console.log("No active track or API not initialized");
      return null;
    }

    await getPlaystateApi(api).onPlaybackStart({
      itemId: activeTrack?.id,
      mediaSourceId: activeTrack?.id,
      playMethod: PlayMethod.Transcode,
    });
  } catch (error) {
    console.error("Failed to sync playback start:", error);
  }
};

export const syncPlaybackProgress = async () => {
  try {
    const [activeTrack, position] = await Promise.all([
      TrackPlayer.getActiveTrack(),
      TrackPlayer.getProgress().then((progress) => progress.position),
    ]);

    const api = apiService.getApi();

    if (!activeTrack?.url || !api) {
      console.log("No active track or API not initialized");
      return null;
    }

    await getPlaystateApi(api).onPlaybackProgress({
      itemId: activeTrack?.id,
      mediaSourceId: activeTrack?.id,
      playMethod: PlayMethod.Transcode,
      positionTicks: secondsToTicks(position),
    });
  } catch (error) {
    console.error("Failed to sync playback progress:", error);
  }
};
