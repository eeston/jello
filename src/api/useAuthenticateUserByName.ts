import { Api } from "@jellyfin/sdk";
import { AuthenticationResult } from "@jellyfin/sdk/lib/generated-client";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { type AxiosResponse } from "axios";

type AuthenticateUserByNameType = {
  api: Api;
  password: string;
  username: string;
};

export const useAuthenticateUserByName = (): UseMutationResult<
  AxiosResponse<AuthenticationResult, any>,
  Error,
  AuthenticateUserByNameType,
  unknown
> => {
  const auth = useMutation({
    gcTime: 0,
    mutationFn: async ({
      api,
      password,
      username,
    }: AuthenticateUserByNameType) => {
      const auth = await api?.authenticateUserByName(username, password);
      return auth;
    },
  });

  return auth;
};
