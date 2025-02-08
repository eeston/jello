import { Api } from "@jellyfin/sdk";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { useFetchUser } from "@src/api/useFetchUser";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchAlbumDetails = (
  api: Api,
  albumId: string,
): UseQueryResult<BaseItemDto, Error> => {
  const user = useFetchUser(api);
  const albumDetails = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getUserLibraryApi(api).getItem({
        itemId: albumId,
        userId: user?.data?.Id,
      });
      return result.data;
    },
    queryKey: ["albumDetails", albumId],
  });

  return albumDetails;
};
