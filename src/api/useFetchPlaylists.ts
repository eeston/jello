import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { QUERY_KEYS } from "@src/api/useCommonQuery";
import { useFetchUser } from "@src/api/useFetchUser";
import { getParentId } from "@src/util/getParentId";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useFetchPlaylists = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const playlists = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        includeItemTypes: [BaseItemKind.Playlist],
        parentId: getParentId(),
        recursive: true,
        sortBy: [ItemSortBy.SortName],
        sortOrder: [SortOrder.Ascending],
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: QUERY_KEYS.playlists.list,
  });

  return playlists;
};
