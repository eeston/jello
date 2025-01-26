import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

import { STORE_ACCESS_TOKEN_KEY, STORE_SERVER_ADDRESS_KEY } from "../constants";

// TODO: this now uses a sync method so a hook is no longer required
export const useSecureStoreItems = () => {
  const [data, setData] = useState<null | string[]>(null);
  const [isLoading, setIsLoading] = useState(true);

  const keys = [STORE_ACCESS_TOKEN_KEY, STORE_SERVER_ADDRESS_KEY];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const results = await Promise.all(
        keys.map((key) => SecureStore.getItem(key)),
      );
      setData(results as null | string[]);
      setIsLoading(false);
    };

    fetchData();
  }, [keys]);

  const bothKeysExist = data && data.every((item) => item !== null);

  return { bothKeysExist, data, isLoading };
};
