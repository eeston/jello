import TrackPlayer, { Event } from "react-native-track-player";

import { syncPlaybackStart, syncPlaybackProgress } from "../api/playback";

export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    return TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    return TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    return TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    return TrackPlayer.skipToPrevious();
  });
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    return TrackPlayer.reset();
  });
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });
  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, () => {
    syncPlaybackStart();
  });
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
    console.log({ PlaybackProgressUpdated: event });
    syncPlaybackProgress();
  });
  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    console.log({ PlaybackState: event });
  });
};
