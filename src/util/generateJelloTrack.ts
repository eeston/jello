import { Api } from "@jellyfin/sdk";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { generateTrackUrl } from "@src/util/generateTrackUrl";
import { ticksToSeconds } from "@src/util/time";
import {
  type PitchAlgorithm as RntpPitchAlgorithm,
  type TrackMetadataBase as RntpTrackMetadataBase,
  type TrackType as RntpTrackType,
} from "react-native-track-player";

export type JelloTrackItem = {
  /**
   * @description album artwork blurhash
   */
  artworkBlur: string;

  /**
   * @description jellyfin id
   */
  id: string;

  /**
   * @description album index
   */
  index: number;
} & RntpAddTrack &
  RntpTrack &
  RntpTrackMetadataBase;

export const generateJelloTrack = (
  jellyfinTrack: BaseItemDto,
  api: Api,
  userId: string,
): JelloTrackItem => {
  if (!jellyfinTrack) {
    // return something
  }

  return {
    album: jellyfinTrack.Album ?? "Unknown Album",
    artist: jellyfinTrack.AlbumArtist ?? "Unknown Artist",
    // rating
    artwork: generateArtworkUrl({
      api,
      id: jellyfinTrack.AlbumId,
    }),
    // type
    // userAgent
    // isLiveStream
    artworkBlur: extractPrimaryHash(jellyfinTrack.ImageBlurHashes),
    // contentType
    duration: ticksToSeconds(jellyfinTrack.RunTimeTicks),
    id: jellyfinTrack.Id ?? "Unkown ID",
    index: jellyfinTrack.IndexNumber ?? 0,
    // description
    // genre
    // date
    title: jellyfinTrack.Name ?? "Unkown Title",
    // pitchAlgorithm
    // headers
    url: generateTrackUrl({
      api,
      trackId: jellyfinTrack.Id,
      userId,
    }),
  };
};

/** A copy of some exported RNTP types, but without `[key: string]: any;` to help keep types safe */
type RntpTrack = {
  /** Mime type of the media file */
  contentType?: string;
  headers?: {
    [key: string]: any;
  };
  /** (iOS only) The pitch algorithm to apply to the sound. */
  pitchAlgorithm?: RntpPitchAlgorithm;
  type?: RntpTrackType;
  url: string;
  /** The user agent HTTP header */
  userAgent?: string;
};

type RntpAddTrack = {
  /** Mime type of the media file */
  contentType?: string;
  headers?: {
    [key: string]: any;
  };
  /** (iOS only) The pitch algorithm to apply to the sound. */
  pitchAlgorithm?: RntpPitchAlgorithm;
  type?: RntpTrackType;
  url: string;
  /** The user agent HTTP header */
  userAgent?: string;
};
