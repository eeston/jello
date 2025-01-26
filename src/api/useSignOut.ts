import {
  STORE_ACCESS_TOKEN_KEY,
  STORE_SELECTED_MUSIC_LIBRARY,
  STORE_SERVER_ADDRESS_KEY,
} from "@src/constants";
import { useAuth } from "@src/store/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";

export const useSignOut = () => {
  const { api, rmApi } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      queryClient.clear();
      api?.logout();
      rmApi();
      await Promise.all([
        SecureStore.deleteItemAsync(STORE_ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(STORE_SERVER_ADDRESS_KEY),
        SecureStore.deleteItemAsync(STORE_SELECTED_MUSIC_LIBRARY),
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });
};
