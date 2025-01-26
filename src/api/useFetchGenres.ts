import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getGenresApi } from "@jellyfin/sdk/lib/utils/api/genres-api";
import { useFetchUser } from "@src/api/useFetchUser";
import { getParentId } from "@src/util/getParentId";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchGenres = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);

  const genres = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getGenresApi(api).getGenres({
        includeItemTypes: [BaseItemKind.Audio],
        parentId: getParentId(),
        sortBy: [ItemSortBy.SortName],
        sortOrder: [SortOrder.Ascending],
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: ["genres"],
  });

  return genres;
};
