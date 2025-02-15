import { syncPlaybackProgress, syncPlaybackStart } from "@src/api/playback";
import { fetchRadioInfo } from "@src/api/radio";
import TrackPlayer, { Event, State } from "react-native-track-player";

export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await TrackPlayer.skipToPrevious();
  });
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    return TrackPlayer.reset();
  });
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });
  TrackPlayer.addEventListener(
    Event.PlaybackActiveTrackChanged,
    async (event) => {
      const activeTrack = await TrackPlayer.getActiveTrack();
      // no sync required for radio
      if (!activeTrack?.isLiveStream) {
        syncPlaybackStart();
      }
    },
  );
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async (event) => {
    const activeTrack = await TrackPlayer.getActiveTrack();
    if (!activeTrack?.isLiveStream) {
      // no sync required for radio
      syncPlaybackProgress();
    } else {
      const radioData = await fetchRadioInfo({
        trackArtworkUrl: "https://www.chilltrax.com/php/GetCoverImageNew.php",
        trackDetailsUrl:
          "https://www.chilltrax.com/php/GetSongInformationNew.php",
      });

      const metdata = {
        artist: radioData.trackDetails.artist,
        artwork: radioData.artwork.cover.replace(/300/g, "1000"),
        title: radioData.trackDetails.title,
      };

      TrackPlayer.updateMetadataForTrack(0, metdata);
      TrackPlayer.updateNowPlayingMetadata(metdata);
    }
  });
  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    if (event.state === State.Ended) {
      TrackPlayer.reset();
    }
  });
  TrackPlayer.addEventListener(Event.RemoteLike, async () => {
    // TODO: not really sure why this doesn't show up on the home screen
    // const currentTrack = await getActiveTrack();
    // addFavouriteTrack({ api: apiService?.getApi(), itemId: currentTrack?.id });
    // const nowPlayingIndex = await getActiveTrackIndex();
    // await TrackPlayer.updateMetadataForTrack(nowPlayingIndex, {
    //   rating: RatingType.Heart,
    // });
  });

  TrackPlayer.addEventListener(Event.RemoteDislike, async () => {
    // TODO: not really sure why this doesn't show up on the home screen
    // const currentTrack = await getActiveTrack();
    // removeFavouriteTrack({
    //   api: apiService?.getApi(),
    //   itemId: currentTrack?.id,
    // });
    // const nowPlayingIndex = await getActiveTrackIndex();
    // await TrackPlayer.updateMetadataForTrack(nowPlayingIndex, {
    //   rating: undefined,
    // });
  });
};
