import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
  ItemFilter,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useFetchUser } from "@src/api/useFetchUser";
import { FETCH_HOME_ITEM_COUNT_LIMIT } from "@src/constants";
import { getParentId } from "@src/util/getParentId";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchFavouriteAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const favouriteAlbums = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        filters: [ItemFilter.IsFavorite],
        includeItemTypes: [BaseItemKind.MusicAlbum],
        limit: FETCH_HOME_ITEM_COUNT_LIMIT,
        parentId: getParentId(),
        recursive: true,
        sortBy: [ItemSortBy.Random],
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: ["favouriteAlbums"],
  });

  return favouriteAlbums;
};
