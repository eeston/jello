import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useFetchUser } from "@src/api/useFetchUser";
import {
  FETCH_HOME_ITEM_COUNT_LIMIT,
  FETCH_RECENTLY_AND_FREQUENTLY_PLAYED_BATCH_LIMIT,
  FETCH_REQUEST_COUNT_LIMIT,
} from "@src/constants";
import { getParentId } from "@src/util/getParentId";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchFrequentlyPlayedAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artistAlbums = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const uniqueAlbumIds = new Set();
      const uniqueItems = [];
      let totalItemsFetched = 0;
      let requestCount = 0;

      while (
        uniqueItems.length < FETCH_HOME_ITEM_COUNT_LIMIT &&
        requestCount < FETCH_REQUEST_COUNT_LIMIT
      ) {
        // try to prevent this from getting stuck in an infinite loop if
        // the user has little or no recently played albums.
        requestCount++;
        const result = await getItemsApi(api).getItems({
          includeItemTypes: [BaseItemKind.Audio],
          // larger batches mean potentially more unnecessary data being fetched.
          limit: FETCH_RECENTLY_AND_FREQUENTLY_PLAYED_BATCH_LIMIT,
          parentId: getParentId(),
          recursive: true,
          sortBy: [ItemSortBy.PlayCount],
          // try to load more up front to prevent multiple requests.
          // smaller batches mean more requests, which can cause strain on a server.
          sortOrder: [SortOrder.Descending],
          startIndex: totalItemsFetched,
          userId: user.data?.Id,
        });

        totalItemsFetched += (result?.data?.Items ?? []).length;

        for (const item of result?.data?.Items ?? []) {
          if (!uniqueAlbumIds.has(item.AlbumId)) {
            uniqueAlbumIds.add(item.AlbumId);
            uniqueItems.push(item);
          }

          if (uniqueItems.length >= FETCH_HOME_ITEM_COUNT_LIMIT) {
            break;
          }
        }
      }
      return { Items: uniqueItems.slice(0, FETCH_HOME_ITEM_COUNT_LIMIT) };
    },
    queryKey: ["frequentlyPlayedAlbums"],
    staleTime: 1000 * 60,
  });
  return artistAlbums;
};
