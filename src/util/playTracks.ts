import { JelloTrackItem } from "@src/util/generateJelloTrack";
import { shuffleArray } from "@src/util/shuffleArray";
import { vibrateLight } from "@src/util/vibrate";
import TrackPlayer from "react-native-track-player";

export const playTracks = ({
  shuffle,
  skipToIndex,
  tracks = [],
}: {
  shuffle?: boolean;
  skipToIndex?: number;
  tracks?: JelloTrackItem[];
}) => {
  TrackPlayer.reset();

  if (shuffle) {
    TrackPlayer.add(shuffleArray(tracks ?? []), 0);
  } else {
    TrackPlayer.add(tracks, 0);
  }

  if (skipToIndex) {
    TrackPlayer.skip(skipToIndex);
  }

  vibrateLight();
  TrackPlayer.play();
};
