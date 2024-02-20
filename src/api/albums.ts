import { Api } from "@jellyfin/sdk";
import {
  BaseItemDto,
  BaseItemDtoQueryResult,
  BaseItemKind,
  ItemFilter,
  SortOrder,
} from "@jellyfin/sdk/lib/generated-client";
import { ItemSortBy } from "@jellyfin/sdk/lib/models/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getSuggestionsApi } from "@jellyfin/sdk/lib/utils/api/suggestions-api";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { useFetchUser } from "./user";
import { getParentId } from "../util/getParentId";

const ITEM_COUNT_LIMIT = 6;
const FETCH_COUNT_LIMIT = 10;

export const useFetchAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const albums = useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        userId: user.data?.Id,
        includeItemTypes: [BaseItemKind.MusicAlbum],
        sortBy: [ItemSortBy.Name],
        sortOrder: [SortOrder.Ascending],
        recursive: true,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return albums;
};

export const useFetchAlbumDetails = (
  api: Api,
  albumId: string,
): UseQueryResult<BaseItemDto, Error> => {
  const user = useFetchUser(api);
  const albumDetails = useQuery({
    queryKey: ["albumDetails", albumId],
    queryFn: async () => {
      const result = await getUserLibraryApi(api).getItem({
        userId: user?.data?.Id,
        itemId: albumId,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return albumDetails;
};

export const useFetchAlbumSongs = (
  api: Api,
  albumId: string,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const albumSongs = useQuery({
    queryKey: ["albumSongs", albumId],
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        userId: user?.data?.Id,
        parentId: String(albumId),
        sortBy: [ItemSortBy.SortName],
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return albumSongs;
};

export const useFetchMoreArtistAlbums = (
  api: Api,
  artistId: string,
  excludeAlbumId: string,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artistAlbums = useQuery({
    queryKey: ["moreArtistAlbums", artistId, excludeAlbumId],
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        userId: user.data?.Id,
        albumArtistIds: [artistId],
        sortBy: [ItemSortBy.Name],
        sortOrder: [SortOrder.Ascending],
        recursive: true,
        includeItemTypes: [BaseItemKind.MusicAlbum],
        excludeItemIds: [excludeAlbumId],
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return artistAlbums;
};

export const useFetchRecentlyAddedAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artistAlbums = useQuery({
    queryKey: ["recentlyAddedAlbums"],
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        userId: user.data?.Id,
        sortBy: [ItemSortBy.DateCreated],
        sortOrder: [SortOrder.Descending],
        recursive: true,
        includeItemTypes: [BaseItemKind.MusicAlbum],
        limit: 10,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return artistAlbums;
};

export const useFetchRecentlyPlayedAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artistAlbums = useQuery({
    queryKey: ["recentlyPlayedAlbums"],
    queryFn: async () => {
      const uniqueAlbumIds = new Set();
      const uniqueItems = [];
      let totalItemsFetched = 0;
      let requestCount = 0;

      while (
        uniqueItems.length < ITEM_COUNT_LIMIT &&
        requestCount < FETCH_COUNT_LIMIT
      ) {
        // try to prevent this from getting stuck in an infinite loop if
        // the user has little or no recently played albums.
        requestCount++;
        const result = await getItemsApi(api).getItems({
          userId: user.data?.Id,
          sortBy: [ItemSortBy.DatePlayed],
          sortOrder: [SortOrder.Descending],
          recursive: true,
          includeItemTypes: [BaseItemKind.Audio],
          // try to load more up front to prevent multiple requests.
          // smaller batches mean more requests, which can cause strain on a server.
          // larger batches mean potentially more unnecessary data being fetched.
          limit: ITEM_COUNT_LIMIT * 4,
          startIndex: totalItemsFetched,
          parentId: getParentId(),
        });

        totalItemsFetched += (result?.data?.Items ?? []).length;

        for (const item of result?.data?.Items) {
          if (!uniqueAlbumIds.has(item.AlbumId)) {
            uniqueAlbumIds.add(item.AlbumId);
            uniqueItems.push(item);
          }

          if (uniqueItems.length >= ITEM_COUNT_LIMIT) {
            break;
          }
        }
      }
      return { Items: uniqueItems.slice(0, ITEM_COUNT_LIMIT) };
    },
    enabled: !!user.isSuccess,
    staleTime: 1000 * 60,
  });

  return artistAlbums;
};

export const useFetchFavouriteAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artistAlbums = useQuery({
    queryKey: ["favouriteAlbums"],
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        userId: user.data?.Id,
        sortBy: [ItemSortBy.IsFavoriteOrLiked],
        filters: [ItemFilter.IsFavorite],
        sortOrder: [SortOrder.Descending],
        recursive: true,
        includeItemTypes: [BaseItemKind.MusicAlbum],
        limit: ITEM_COUNT_LIMIT,
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return artistAlbums;
};

export const useFrequentlyPlayedAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artistAlbums = useQuery({
    queryKey: ["frequentlyPlayedAlbums"],
    queryFn: async () => {
      const uniqueAlbumIds = new Set();
      const uniqueItems = [];
      let totalItemsFetched = 0;
      let requestCount = 0;

      while (
        uniqueItems.length < ITEM_COUNT_LIMIT &&
        requestCount < FETCH_COUNT_LIMIT
      ) {
        // try to prevent this from getting stuck in an infinite loop if
        // the user has little or no recently played albums.
        requestCount++;
        const result = await getItemsApi(api).getItems({
          userId: user.data?.Id,
          sortBy: [ItemSortBy.PlayCount],
          sortOrder: [SortOrder.Descending],
          recursive: true,
          includeItemTypes: [BaseItemKind.Audio],
          // try to load more up front to prevent multiple requests.
          // smaller batches mean more requests, which can cause strain on a server.
          // larger batches mean potentially more unnecessary data being fetched.
          limit: ITEM_COUNT_LIMIT * 4,
          startIndex: totalItemsFetched,
          parentId: getParentId(),
        });

        totalItemsFetched += (result?.data?.Items ?? []).length;

        for (const item of result?.data?.Items) {
          if (!uniqueAlbumIds.has(item.AlbumId)) {
            uniqueAlbumIds.add(item.AlbumId);
            uniqueItems.push(item);
          }

          if (uniqueItems.length >= ITEM_COUNT_LIMIT) {
            break;
          }
        }
      }
      return { Items: uniqueItems.slice(0, ITEM_COUNT_LIMIT) };
    },
    enabled: !!user.isSuccess,
    staleTime: 1000 * 60,
  });
  return artistAlbums;
};

// TODO: this api is goosed...filters don't work
// ...or maybe I'm being an idiot.
export const useFetchSuggestedAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);

  const artistAlbums = useQuery({
    queryKey: ["suggestedAlbums"],
    queryFn: async () => {
      const result = await getSuggestionsApi(api).getSuggestions({
        userId: user.data?.Id,
        mediaTypes: ["music"], //fucked
        includeItemTypes: [BaseItemKind.MusicAlbum], //fucked
        excludeItemTypes: Object.values(BaseItemKind).filter(
          (i) => i !== BaseItemKind.MusicAlbum,
        ), //fucked
        limit: 6, //the only thing that works
        parentId: getParentId(),
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return artistAlbums;
};
