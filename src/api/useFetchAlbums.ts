import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useFetchUser } from "@src/api/useFetchUser";
import { getParentId } from "@src/util/getParentId";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const albums = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        includeItemTypes: [BaseItemKind.MusicAlbum],
        parentId: getParentId(),
        recursive: true,
        sortBy: [ItemSortBy.Name],
        sortOrder: [SortOrder.Ascending],
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: ["albums"],
  });

  return albums;
};
