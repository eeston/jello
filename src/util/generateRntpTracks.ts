import { Api } from "@jellyfin/sdk";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { getColors } from "react-native-image-colors";
import { type IOSImageColors } from "react-native-image-colors/build/types";
import { AddTrack as RntpTrack } from "react-native-track-player";

import { extractPrimaryHash } from "./extractPrimaryHash";
import { generateTrackArtworkUrl } from "./generateTrackArtworkUrl";
import { generateTrackUrl } from "./generateTrackUrl";
import { ticksToSeconds } from "./time";

export const generateRntpTracks = async ({
  tracks,
  api,
  userId,
  albumDetails,
}: {
  tracks: BaseItemDto[];
  api: Api;
  userId: string;
  albumDetails?: BaseItemDto;
}): Promise<RntpTrack[]> => {
  const jelloTracks: RntpTrack[] = [];

  for (const track of tracks) {
    const artworkId = albumDetails?.Id ?? track?.AlbumId;
    const artworkUrl = artworkId
      ? generateTrackArtworkUrl({ id: artworkId, api })
      : undefined;
    const url = generateTrackUrl({ trackId: track?.Id as string, api, userId });
    const artworkBlurHash = extractPrimaryHash(track?.ImageBlurHashes);
    const duration = ticksToSeconds(track?.RunTimeTicks ?? 0);

    let colours = {};
    try {
      if (artworkUrl) {
        // TODO: this is kinda slow
        colours = await getColors(artworkUrl, {
          cache: true,
          key: artworkUrl,
          quality: "lowest",
        });
      }
    } catch (err) {
      // TODO: what to do?
      console.log("Error getting colors", err);
    }

    const {
      primary: artworkPrimary = "#000000",
      secondary: artworkSecondary = "#000000",
      background: artworkBackground = "#000000",
      detail: artworkDetail = "#000000",
    } = colours as IOSImageColors;

    const jelloTrack: RntpTrack = {
      album: track?.Album ?? "Unknown Album",
      albumId: track?.AlbumId,
      artist: track?.AlbumArtist ?? "Unknown Artist",
      artistId: track?.AlbumArtists?.[0]?.Id,
      artwork: artworkUrl,
      artworkBackground,
      artworkBlurHash,
      artworkDetail,
      artworkPrimary,
      artworkSecondary,
      duration,
      id: track?.Id as string,
      title: track?.Name ?? "Unknown Track",
      url,
    };

    jelloTracks.push(jelloTrack);
  }

  return jelloTracks;
};
