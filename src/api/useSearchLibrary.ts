import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
} from "@jellyfin/sdk/lib/generated-client";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { fetchAlbums } from "@src/api/useFetchAlbums";
import { fetchArtists } from "@src/api/useFetchArtists";
import { useFetchUser } from "@src/api/useFetchUser";
import { generateJelloTrack } from "@src/util/generateJelloTrack";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useSearchLibrary = (
  api: Api,
  query?: string,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const response = useDebouncedQuery({
    enabled: !!user.isSuccess && !!query,
    queryFn: async () => {
      const searchParams = {
        api,
        searchTerm: query,
        userId: user.data?.Id ?? "",
      };

      const [artists, albums, songs] = await Promise.all([
        fetchArtists(searchParams),
        fetchAlbums(searchParams),
        fetchSongs(searchParams),
      ]);

      const combinedItems = [
        ...(artists.data.Items ?? []),
        ...(albums.data.Items ?? []),
        ...(songs?.data?.Items ?? [])
          .map((item) => generateJelloTrack(item, api, user?.data?.Id))
          .map((track) => ({
            ...track,
            Type: BaseItemKind.Audio,
          })),
      ];

      // not really sure if this is a good idea but it helps shuffle
      // the items so there's not blocks of artists, albums etc
      for (let i = combinedItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combinedItems[i], combinedItems[j]] = [
          combinedItems[j],
          combinedItems[i],
        ];
      }

      return {
        Items: combinedItems,
        StartIndex: 0,
        TotalRecordCount:
          (artists.data.TotalRecordCount ?? 0) +
          (albums.data.TotalRecordCount ?? 0),
      };
    },
    queryKey: ["library", query],
  });

  return response;
};

// TODO: find new home
const fetchSongs = ({
  api,
  searchTerm,
  userId,
}: {
  api: Api;
  searchTerm?: string;
  userId: string;
}) => {
  return getItemsApi(api).getItems({
    includeItemTypes: [BaseItemKind.Audio],
    limit: 10,
    recursive: true,
    searchTerm,
    userId,
  });
};

// TODO: find new home
export const useDebouncedQuery = (
  params,
  request,
  { debounce = 1000, ...options } = {},
) => {
  const [newParams, setNewParams] = useState(params);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const stringify = (obj) => JSON.stringify(obj);

  useEffect(() => {
    if (stringify(params) !== stringify(newParams)) {
      const isQueryEmpty =
        params.queryKey?.[1] === "" || params.queryKey?.[1] === undefined;

      if (isQueryEmpty) {
        // update immediately without debouncing if query is empty
        setNewParams(params);
        setIsDebouncing(false);
      } else {
        setIsDebouncing(true);
        const timerId = setTimeout(() => {
          setNewParams(params);
          setIsDebouncing(false);
        }, debounce);
        return () => clearTimeout(timerId);
      }
    }
  }, [params, debounce]);

  const result = useQuery(newParams, request, options);
  return {
    ...result,
    isDebouncing,
  };
};
