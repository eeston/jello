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

// TODO: just use listArtistAlbums and ignore
// ignore the one being viewed
export const useFetchMoreArtistAlbums = (
  api: Api,
  artistId: string,
  excludeAlbumId: string,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artistAlbums = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        albumArtistIds: [artistId],
        excludeItemIds: [excludeAlbumId],
        includeItemTypes: [BaseItemKind.MusicAlbum],
        parentId: getParentId(),
        recursive: true,
        sortBy: [ItemSortBy.Name],
        sortOrder: [SortOrder.Ascending],
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: ["moreArtistAlbums", artistId, excludeAlbumId],
  });

  return artistAlbums;
};
