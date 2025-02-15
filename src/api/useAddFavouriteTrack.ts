import { UserItemDataDto } from "@jellyfin/sdk/lib/generated-client";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface AddFavoriteMutation {
  api: any;
  id: string;
  isFavourite: boolean;
}

export const useToggleFavouriteTrack = (): UseMutationResult<
  AxiosResponse<UserItemDataDto>,
  Error,
  AddFavoriteMutation
> => {
  const queryClient = useQueryClient();
  return useMutation({
    gcTime: 0,
    mutationFn: async ({ api, id, isFavourite }: AddFavoriteMutation) => {
      if (isFavourite) {
        return removeFavouriteTrack({ api, itemId: id });
      } else {
        return addFavouriteTrack({ api, itemId: id });
      }
    },
    onSuccess(data, variables, context) {
      // update current track metadata
      queryClient.invalidateQueries({
        // TODO: finetune this
        queryKey: ["albumSongs"],
      });
      queryClient.invalidateQueries({
        // TODO: finetune this
        queryKey: ["favouriteSongs"],
      });
    },
  });
};

export const addFavouriteTrack = ({ api, itemId }) => {
  return getUserLibraryApi(api).markFavoriteItem({
    itemId,
  });
};
export const removeFavouriteTrack = ({ api, itemId }) => {
  return getUserLibraryApi(api).unmarkFavoriteItem({
    itemId,
  });
};
