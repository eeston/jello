import { Api } from "@jellyfin/sdk";
import { getPlaylistsApi } from "@jellyfin/sdk/lib/utils/api/playlists-api";
import { useFetchUser } from "@src/api/useFetchUser";
import {
  JelloTrackItem,
  generateJelloTrack,
} from "@src/util/generateJelloTrack";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchPlaylistSongs = (
  api: Api,
  playlistId: string,
): UseQueryResult<
  {
    tracks: JelloTrackItem[];
  },
  Error
> => {
  const user = useFetchUser(api);
  const playlistSongs = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getPlaylistsApi(api).getPlaylistItems({
        playlistId,
        userId: user.data?.Id,
      });

      const tracks = (result?.data?.Items ?? []).map((item) =>
        generateJelloTrack(item, api, user?.data?.Id),
      );

      return { tracks };
    },
    queryKey: ["playlistSongs", playlistId],
  });

  return playlistSongs;
};
