import { Api } from "@jellyfin/sdk";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { useFetchUser } from "@src/api/useFetchUser";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchPlaylistDetails = (
  api: Api,
  playlistId: string,
): UseQueryResult<BaseItemDto, Error> => {
  const user = useFetchUser(api);
  const playlistDetails = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getUserLibraryApi(api).getItem({
        itemId: playlistId,
        userId: user.data?.Id,
      });
      return result.data;
    },
    queryKey: ["playlistDetails", playlistId],
  });

  return playlistDetails;
};
