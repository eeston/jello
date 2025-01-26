import {
  STORE_ACCESS_TOKEN_KEY,
  STORE_SERVER_ADDRESS_KEY,
} from "@src/constants";
import { useAuth } from "@src/store/AuthContext";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";

type CreateApiWithTokenType = {
  accessToken: string;
  basePath: string;
};

export const useCreateApiWithToken = (): UseMutationResult<
  void,
  Error,
  CreateApiWithTokenType,
  unknown
> => {
  // TODO: mv here
  const { createApiWithToken } = useAuth();

  return useMutation({
    gcTime: 0,
    mutationFn: async ({ accessToken, basePath }: CreateApiWithTokenType) => {
      await Promise.all([
        SecureStore.setItemAsync(STORE_ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(STORE_SERVER_ADDRESS_KEY, basePath),
      ]);

      createApiWithToken({
        serverAddress: basePath,
        token: accessToken,
      });
    },
  });
};
