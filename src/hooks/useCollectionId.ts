import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

import { STORE_SELECTED_MUSIC_LIBRARY } from "../constants";
import { useApi } from "../store/useJelloAuth";

export const processCollections = (collections: BaseItemDto[]) => {
  const musicCollections = collections.filter(
    //   (c) => c.CollectionType === CollectionTypeOptions.Music, // DOH! incorrect type
    (c) => c.CollectionType === "music",
  );

  return {
    id: musicCollections[0]?.Id,
    name: musicCollections[0]?.Name,
  };
};

export const useCheckCollectionId = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi((state) => state.api);

  useEffect(() => {
    const checkCollectionId = async () => {
      setLoading(true);
      try {
        const existingCollectionId = SecureStore.getItem(
          STORE_SELECTED_MUSIC_LIBRARY,
        );

        if (!existingCollectionId && api?.accessToken) {
          const response = await fetch(
            `${api?.basePath}/Items?recursive=true&includeItemTypes=CollectionFolder&api_key=${api?.accessToken}`,
          );

          const collections = await response.json();
          const musicCollections = processCollections(collections.Items);

          SecureStore.setItem(
            STORE_SELECTED_MUSIC_LIBRARY,
            JSON.stringify(musicCollections),
          );
        }
      } catch (err) {
        console.log({ err });
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    checkCollectionId();
  }, [api?.accessToken]);

  return { loading, error };
};
