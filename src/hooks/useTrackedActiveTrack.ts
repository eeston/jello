import { useEffect, useState } from "react";
import TrackPlayer, { Event, Track } from "react-native-track-player";

// https://github.com/doublesymmetry/react-native-track-player/issues/2158
export const useTrackedActiveTrack = () => {
  const [track, setTrack] = useState<Track | null | undefined>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      const currentTrack = await TrackPlayer.getActiveTrack();
      setTrack(currentTrack);
    };

    // TODO: check these
    const events = [
      Event.PlaybackActiveTrackChanged,
      Event.MetadataCommonReceived,
    ];

    const unsubscribe = events.map((event) =>
      TrackPlayer.addEventListener(event, fetchTrack),
    );

    fetchTrack();
    return () => {
      unsubscribe.forEach((sub) => sub.remove());
    };
  }, []);

  return track;
};
