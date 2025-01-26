import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useFetchUser } from "@src/api/useFetchUser";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchGenreAlbums = (
  api: Api,
  genreId: string,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const genreAlbums = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        genreIds: [genreId],
        includeItemTypes: [BaseItemKind.MusicAlbum],
        recursive: true,
        sortBy: [ItemSortBy.Name],
        sortOrder: [SortOrder.Ascending],
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: ["genreAlbums", genreId],
  });

  return genreAlbums;
};
