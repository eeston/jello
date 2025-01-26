import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
// import { Audio, AVPlaybackStatus, InterruptionModeIOS } from "expo-av";
import { create } from "zustand";

interface JelloBaseItemDto extends BaseItemDto {
  CustomFieldArtworkUrl: string;
  CustomFieldTrackUrl: string;
}

interface AudioStore {
  // State
  currentQueueIndex: number;
  currentTrack: JelloBaseItemDto | null;
  duration: number;
  isLoading: boolean;
  // sound: Audio.Sound | null;
  isPlaying: boolean;
  loadAudio: (track: JelloBaseItemDto) => Promise<void>;
  pauseSound: () => Promise<void>;
  // Actions
  playSound: (tracks: JelloBaseItemDto[], startIndex?: number) => Promise<void>;

  position: number;
  queue: JelloBaseItemDto[];
  setCurrentQueueIndex: (index: number) => void;
  setCurrentTrack: (track: JelloBaseItemDto | null) => void;
  setDuration: (duration: number) => void;
  setIsLoading: (isLoading: boolean) => void;

  // Internal actions
  // setSound: (sound: Audio.Sound | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setQueue: (queue: JelloBaseItemDto[]) => void;
  skipToNextTrack: () => Promise<void>;
  skipToPreviousTrack: () => Promise<void>;
  stopSound: () => Promise<void>;
  volume: number;
}

// Setup audio mode
const setupAudio = async () => {
  // await Audio.setAudioModeAsync({
  //   allowsRecordingIOS: false,
  //   staysActiveInBackground: true,
  //   playsInSilentModeIOS: true,
  //   interruptionModeIOS: InterruptionModeIOS.DoNotMix,
  // });
};

setupAudio();

export const useAudioStore = create<AudioStore>((set, get) => ({
  currentQueueIndex: -1,
  currentTrack: null,
  duration: 0,
  isLoading: false,
  isPlaying: false,
  // Load and prepare audio for playing
  loadAudio: async (track: JelloBaseItemDto) => {
    try {
      // set({ currentTrack: track });
      // // const { sound: currentSound, setSound } = get();
      // if (!track.CustomFieldTrackUrl) {
      //   throw new Error("Track URI is missing");
      // }
      // // // Stop and unload current sound
      // // if (currentSound) {
      // //   await currentSound.unloadAsync();
      // //   setSound(null);
      // // }
      // const { sound: newSound } = await Audio.Sound.createAsync(
      //   { uri: track.CustomFieldTrackUrl },
      //   { shouldPlay: false },
      // );
      // // Set up the status update callback
      // newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      //   const { onPlaybackStatusUpdate } = get();
      //   onPlaybackStatusUpdate(status);
      // });
      // setSound(newSound);
    } catch (error) {
      set({ isLoading: false });
      console.error("Error loading audio:", error);
      throw error;
    }
  },
  // Playback status update handler
  onPlaybackStatusUpdate: (status) => {
    // if (status.isLoaded) {
    //   const { skipToNextTrack } = get();
    //   // Check if track has finished
    //   if (status.didJustFinish) {
    //     skipToNextTrack();
    //     return;
    //   }
    //   set({
    //     position: status.positionMillis,
    //     duration: status.durationMillis ?? 0,
    //     isPlaying: status.isPlaying,
    //   });
    // }
  },
  // Pause sound
  pauseSound: async () => {
    try {
      // const { sound } = get();
      // if (sound) {
      //   await sound.pauseAsync();
      //   set({ isPlaying: false });
      // }
    } catch (error) {
      console.error("Error pausing sound:", error);
      throw error;
    }
  },
  // Play sound with tracks and optional start index
  playSound: async (tracks?: JelloBaseItemDto[], startIndex = 0) => {
    try {
      // if (!tracks || tracks.length === 0) {
      //   const { sound } = get();
      //   if (sound) {
      //     set({ isPlaying: true });
      //     await sound.playAsync();
      //     return;
      //   } else {
      //     throw new Error("No tracks provided");
      //   }
      // }
      // // Ensure start index is valid
      // const safeStartIndex = Math.max(
      //   0,
      //   Math.min(startIndex, tracks.length - 1),
      // );
      // // Set the queue and starting index
      // set({
      //   queue: tracks,
      //   currentQueueIndex: safeStartIndex,
      // });
      // // Load and play the first track
      // set({ isLoading: true });
      // await get().loadAudio(tracks[safeStartIndex]);
      // set({ isLoading: false });
      // const newSound = get().sound;
      // if (newSound) {
      //   await newSound.playAsync();
      //   set({ isPlaying: true });
      // }
    } catch (error) {
      console.error("Error playing sound:", error);
      throw error;
    }
  },

  // State setters
  position: 0,
  queue: [],
  setCurrentQueueIndex: (currentQueueIndex) => set({ currentQueueIndex }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setDuration: (duration) => set({ duration }),
  setIsLoading: (isLoading) => set({ isLoading }),

  // setSound: (sound) => set({ sound }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setQueue: (queue) => set({ queue }),

  // Skip to next track in queue
  skipToNextTrack: async () => {
    const { currentQueueIndex, loadAudio, queue } = get();

    if (queue.length === 0) {
      return;
    }

    const nextIndex = (currentQueueIndex + 1) % queue.length;
    set({ currentQueueIndex: nextIndex });

    try {
      // // Load the next track
      // set({ isLoading: true });
      // await loadAudio(queue[nextIndex]);
      // set({ isLoading: false });
      // // Play the next track
      // const newSound = get().sound;
      // if (newSound) {
      //   await newSound.playAsync();
      //   set({ isPlaying: true });
      // }
    } catch (err) {
      console.log({ err });
    }
  },

  // Skip to previous track in queue
  skipToPreviousTrack: async () => {
    const { currentQueueIndex, loadAudio, queue } = get();

    if (queue.length === 0) return;

    const prevIndex =
      currentQueueIndex > 0 ? currentQueueIndex - 1 : queue.length - 1;

    set({ currentQueueIndex: prevIndex });

    await loadAudio(queue[prevIndex]);
    await get().playSound(queue, prevIndex);
  },

  // Initial state
  sound: null,

  // Stop sound
  stopSound: async () => {
    try {
      // const { sound } = get();
      // if (sound) {
      //   await sound.stopAsync();
      //   await sound.setPositionAsync(0);
      //   set({
      //     isPlaying: false,
      //     queue: [],
      //     currentQueueIndex: -1,
      //   });
      // }
    } catch (error) {
      console.error("Error stopping sound:", error);
      throw error;
    }
  },

  volume: 1.0,
}));
