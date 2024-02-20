import { Api } from "@jellyfin/sdk";
import {
  BaseItemDto,
  BaseItemDtoQueryResult,
  BaseItemKind,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api/artists-api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { useFetchUser } from "./user";
import { getParentId } from "../util/getParentId";

export const useFetchArtists = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artists = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const result = await getArtistsApi(api).getAlbumArtists({
        userId: user.data?.Id,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return artists;
};

export const useFetchArtistDetails = (
  api: Api,
  artistId: string,
): UseQueryResult<BaseItemDto, Error> => {
  const user = useFetchUser(api);
  const artistDetails = useQuery({
    queryKey: ["artistDetails", artistId],
    queryFn: async () => {
      const result = await getUserLibraryApi(api).getItem({
        userId: user.data?.Id,
        itemId: artistId,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return artistDetails;
};

export const useFetchArtistAlbums = (
  api: Api,
  artistId: string,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artistAlbums = useQuery({
    queryKey: ["artistAlbums", artistId],
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        userId: user.data?.Id,
        albumArtistIds: [artistId],
        sortBy: [ItemSortBy.ProductionYear],
        sortOrder: [SortOrder.Descending],
        recursive: true,
        includeItemTypes: [BaseItemKind.MusicAlbum],
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return artistAlbums;
};
