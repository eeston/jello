import { Api } from "@jellyfin/sdk";
import { UserDto } from "@jellyfin/sdk/lib/generated-client";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api/user-api";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export const useFetchUser = (api: Api): UseQueryResult<UserDto, Error> => {
  const user = useQuery({
    enabled: !!api,
    queryFn: async () => {
      const user = await getUserApi(api).getCurrentUser();
      return user.data;
    },
    queryKey: ["user"],
    staleTime: 1000 * 60 * 5, // should prevent the user from being refetched too often
  });

  return user;
};
