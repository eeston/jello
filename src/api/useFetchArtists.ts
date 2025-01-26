import { Api } from "@jellyfin/sdk";
import { BaseItemDtoQueryResult } from "@jellyfin/sdk/lib/generated-client";
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api/artists-api";
import { useFetchUser } from "@src/api/useFetchUser";
import { getParentId } from "@src/util/getParentId";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchArtists = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);
  const artists = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getArtistsApi(api).getAlbumArtists({
        parentId: getParentId(),
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: ["artists"],
  });

  return artists;
};
