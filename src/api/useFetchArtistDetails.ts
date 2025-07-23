import { Api } from "@jellyfin/sdk";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { QUERY_KEYS } from "@src/api/useCommonQuery";
import { useFetchUser } from "@src/api/useFetchUser";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useFetchArtistDetails = (
  api: Api,
  artistId: string,
): UseQueryResult<BaseItemDto, Error> => {
  const user = useFetchUser(api);
  const artistDetails = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getUserLibraryApi(api).getItem({
        itemId: artistId,
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: QUERY_KEYS.artists.details(artistId),
  });

  return artistDetails;
};
