import { Api } from "@jellyfin/sdk";
import { BaseItemKind, SortOrder } from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useFetchUser } from "@src/api/useFetchUser";
import {
  JelloTrackItem,
  generateJelloTrack,
} from "@src/util/generateJelloTrack";
import { getParentId } from "@src/util/getParentId";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchArtistTopSongs = (
  api: Api,
  artistId: string,
  size?: number,
): UseQueryResult<{ tracks: JelloTrackItem[] }, Error> => {
  const user = useFetchUser(api);
  const artistTopSongs = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        albumArtistIds: [artistId],
        includeItemTypes: [BaseItemKind.Audio],
        limit: size,
        parentId: getParentId(),
        recursive: true,
        sortBy: [ItemSortBy.PlayCount],
        sortOrder: [SortOrder.Descending],
        userId: user.data?.Id,
      });

      const tracks = (result?.data?.Items ?? []).map((item) =>
        generateJelloTrack(item, api, user?.data?.Id),
      );

      return { tracks };
    },
    queryKey: ["artistTopSongs", artistId, size],
  });

  return artistTopSongs;
};
