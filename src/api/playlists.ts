import { Api } from "@jellyfin/sdk";
import {
  BaseItemDto,
  BaseItemDtoQueryResult,
  BaseItemKind,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getPlaylistsApi } from "@jellyfin/sdk/lib/utils/api/playlists-api";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { useFetchUser } from "./user";
import { getParentId } from "../util/getParentId";

export const useFetchPlaylists = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const playlists = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        sortBy: [ItemSortBy.SortName],
        sortOrder: [SortOrder.Ascending],
        includeItemTypes: [BaseItemKind.Playlist],
        recursive: true,
        userId: user.data?.Id,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return playlists;
};

export const useFetchPlaylistDetails = (
  api: Api,
  playlistId: string,
): UseQueryResult<BaseItemDto, Error> => {
  const user = useFetchUser(api);
  const playlistDetails = useQuery({
    queryKey: ["playlistDetails", playlistId],
    queryFn: async () => {
      const result = await getUserLibraryApi(api).getItem({
        userId: user.data?.Id,
        itemId: playlistId,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return playlistDetails;
};

export const useFetchPlaylistSongs = (
  api: Api,
  playlistId: string,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const playlistSongs = useQuery({
    queryKey: ["playlistSongs", playlistId],
    queryFn: async () => {
      const result = await getPlaylistsApi(api).getPlaylistItems({
        userId: user.data?.Id,
        playlistId,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return playlistSongs;
};
