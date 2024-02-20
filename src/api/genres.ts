import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getGenresApi } from "@jellyfin/sdk/lib/utils/api/genres-api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { useFetchUser } from "./user";
import { getParentId } from "../util/getParentId";

export const useFetchGenres = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);

  const genres = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const result = await getGenresApi(api).getGenres({
        sortBy: [ItemSortBy.SortName],
        sortOrder: [SortOrder.Ascending],
        userId: user.data?.Id,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return genres;
};

export const useFetchGenreAlbums = (
  api: Api,
  genreId: string,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const genreAlbums = useQuery({
    queryKey: ["genreAlbums", genreId],
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        userId: user.data?.Id,
        includeItemTypes: [BaseItemKind.MusicAlbum],
        sortBy: [ItemSortBy.Name],
        sortOrder: [SortOrder.Ascending],
        recursive: true,
        genreIds: [genreId],
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return genreAlbums;
};
