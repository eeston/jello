import { Api } from "@jellyfin/sdk";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useFetchUser } from "@src/api/useFetchUser";
import {
  JelloTrackItem,
  generateJelloTrack,
} from "@src/util/generateJelloTrack";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchFavouriteSongs = (
  api: Api,
): UseQueryResult<{ tracks: JelloTrackItem[] }, Error> => {
  const user = useFetchUser(api);
  const favouriteSongs = useQuery({
    enabled: !!user.isSuccess,
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        includeItemTypes: [BaseItemKind.Audio],
        isFavorite: true,
        recursive: true,
        userId: user.data?.Id,
      });

      const tracks = (result?.data?.Items ?? []).map((item) =>
        generateJelloTrack(item, api, user?.data?.Id),
      );

      return { tracks };
    },
    queryKey: ["favouriteSongs"],
  });

  return favouriteSongs;
};
