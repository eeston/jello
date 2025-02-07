import { Api, Jellyfin } from "@jellyfin/sdk";
import { STORE_CLIENT_DEVICE_ID } from "@src/constants";
import { useSecureStoreItems } from "@src/hooks/useSecureStoreItems";
import { apiService } from "@src/services/api";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { name, version } from "../../package.json";

type AuthContextType =
  | {
      api: Api | null;
      createApi: (params: { serverAddress: string }) => void;
      createApiWithToken: (params: {
        serverAddress: string;
        token: string;
      }) => void;
      isSignedIn: boolean;
      jellyfin: Jellyfin;
      rmApi: () => void;
    }
  | undefined;

const getDeviceId = () => {
  let deviceId = SecureStore.getItem(STORE_CLIENT_DEVICE_ID);
  if (!deviceId) {
    deviceId = Crypto.randomUUID();
    SecureStore.setItem(STORE_CLIENT_DEVICE_ID, deviceId);
  }
  return deviceId;
};

export const AuthContext = createContext<AuthContextType>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [api, setApi] = useState<Api | null>(null);
  const {
    bothKeysExist,
    data,
    isLoading: checkingKeys,
  } = useSecureStoreItems();
  // const { loading: isSettingLibraryId } = useCheckCollectionId();

  const jellyfin = useMemo(
    () =>
      new Jellyfin({
        clientInfo: {
          name,
          version,
        },
        deviceInfo: {
          id: getDeviceId(),
          name: Device.deviceName,
        },
      }),
    [],
  );

  const updateApi = (newApi: Api | null) => {
    setApi(newApi);
    apiService.setApi(newApi);
  };

  // Handle splash screen
  useEffect(() => {
    async function hideSplash() {
      // Only hide splash screen when we're done checking keys and setting library ID
      if (!checkingKeys) {
        // if (!checkingKeys && !isSettingLibraryId) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [checkingKeys]);

  // Initial auth setup
  useEffect(() => {
    if (bothKeysExist) {
      const [accessToken, serverAddress] = data ?? [];
      const newApi = jellyfin.createApi(serverAddress, accessToken);
      updateApi(newApi);
    }
  }, [bothKeysExist, data, jellyfin]);

  // Don't render children until initialization is complete
  // if (checkingKeys || isSettingLibraryId) {
  if (checkingKeys) {
    return null;
  }

  const value = {
    api,
    createApi: ({ serverAddress }: { serverAddress: string }) => {
      const newApi = jellyfin.createApi(serverAddress);
      updateApi(newApi);
    },
    createApiWithToken: ({
      serverAddress,
      token,
    }: {
      serverAddress: string;
      token: string;
    }) => {
      const newApi = jellyfin.createApi(serverAddress, token);
      updateApi(newApi);
    },
    isSignedIn: !!api?.accessToken,
    jellyfin,
    rmApi: () => {
      updateApi(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hooks to access auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useIsSignedIn(): boolean {
  const { isSignedIn } = useAuth();
  return isSignedIn;
}

export function useIsSignedOut(): boolean {
  const { isSignedIn } = useAuth();
  const isSignedOut = !isSignedIn;
  return isSignedOut;
}
