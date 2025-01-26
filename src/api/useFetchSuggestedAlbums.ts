import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  MediaType,
} from "@jellyfin/sdk/lib/generated-client";
import { getSuggestionsApi } from "@jellyfin/sdk/lib/utils/api/suggestions-api";
import { useFetchUser } from "@src/api/useFetchUser";
import { FETCH_HOME_ITEM_COUNT_LIMIT } from "@src/constants";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchSuggestedAlbums = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);

  const artistAlbums = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getSuggestionsApi(api).getSuggestions({
        limit: FETCH_HOME_ITEM_COUNT_LIMIT,
        mediaType: [MediaType.Audio],
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: ["suggestedAlbums"],
  });

  return artistAlbums;
};
