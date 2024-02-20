import { Api } from "@jellyfin/sdk";
import {
  BaseItemDtoQueryResult,
  BaseItemKind,
} from "@jellyfin/sdk/lib/generated-client";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { useFetchUser } from "./user";

export const useFetchCollections = (
  api: Api,
): UseQueryResult<BaseItemDtoQueryResult, Error> => {
  const user = useFetchUser(api);

  const collections = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const result = await getItemsApi(api).getItems({
        recursive: true,
        includeItemTypes: [BaseItemKind.CollectionFolder],
      });
      return result.data;
    },
    enabled: !!user.isSuccess,
  });

  return collections;
};
