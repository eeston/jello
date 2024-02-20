import * as SecureStore from "expo-secure-store";

import { STORE_SELECTED_MUSIC_LIBRARY } from "../constants";

export const getParentId = (): string => {
  const collection = SecureStore.getItem(STORE_SELECTED_MUSIC_LIBRARY);
  return JSON.parse(collection).id;
};
