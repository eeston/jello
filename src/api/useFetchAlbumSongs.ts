import { Api } from "@jellyfin/sdk";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useFetchUser } from "@src/api/useFetchUser";
import {
  JelloTrackItem,
  generateJelloTrack,
} from "@src/util/generateJelloTrack";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchAlbumSongs = (
  api: Api,
  albumId: string,
): UseQueryResult<{ tracks: JelloTrackItem[] }, Error> => {
  const user = useFetchUser(api);
  const albumSongs = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        parentId: String(albumId),
        sortBy: [ItemSortBy.SortName],
        userId: user?.data?.Id,
      });

      const tracks = (result?.data?.Items ?? []).map((item) =>
        generateJelloTrack(item, api, user?.data?.Id),
      );

      return { tracks };
    },
    queryKey: ["albumSongs", albumId],
  });

  return albumSongs;
};
