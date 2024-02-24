import * as SecureStore from "expo-secure-store";

import { STORE_SELECTED_MUSIC_LIBRARY } from "../constants";

export const getParentId = (): string | undefined => {
  try {
    const collection = SecureStore.getItem(STORE_SELECTED_MUSIC_LIBRARY);
    return collection ? JSON.parse(collection)?.id : undefined;
  } catch (_err) {
    return undefined;
  }
};
