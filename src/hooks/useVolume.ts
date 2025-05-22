import { useCallback, useEffect, useState } from "react";
import TrackPlayer from "react-native-track-player";

export const useVolume = () => {
  const [volume, setVolume] = useState<number>();

  const getVolume = useCallback(async () => {
    const currentVolume = await TrackPlayer.getVolume();
    setVolume(currentVolume);
  }, []);

  const updateVolume = useCallback(async (newVolume: number) => {
    if (newVolume < 0 || newVolume > 1) {
      return;
    }

    setVolume(newVolume);

    await TrackPlayer.setVolume(newVolume);
  }, []);

  useEffect(() => {
    getVolume();
  }, [getVolume]);

  return { updateVolume, volume };
};
