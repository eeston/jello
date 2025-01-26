import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useFetchUser } from "@src/api/useFetchUser";
import { FETCH_LIBRARY_RECENTLY_ADDED_COUNT_LIMIT } from "@src/constants";
import { getParentId } from "@src/util/getParentId";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchRecentlyAddedAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artistAlbums = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        includeItemTypes: [BaseItemKind.MusicAlbum],
        limit: FETCH_LIBRARY_RECENTLY_ADDED_COUNT_LIMIT,
        parentId: getParentId(),
        recursive: true,
        sortBy: [ItemSortBy.DateCreated],
        sortOrder: [SortOrder.Descending],
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: ["recentlyAddedAlbums"],
  });

  return artistAlbums;
};
