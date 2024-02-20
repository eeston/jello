import { Api, Jellyfin } from "@jellyfin/sdk";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { name, version } from "../../package.json";
import { STORE_CLIENT_DEVICE_ID } from "../constants";

type JelloAuthType = {
  api: Api | null;
  jellyfin: Jellyfin;
};

const getDeviceId = () => {
  let deviceId = SecureStore.getItem(STORE_CLIENT_DEVICE_ID);
  if (!deviceId) {
    deviceId = Crypto.randomUUID();
    SecureStore.setItem(STORE_CLIENT_DEVICE_ID, deviceId);
  }
  return deviceId;
};

export const useApi = create<JelloAuthType>(() => ({
  api: null,
  jellyfin: new Jellyfin({
    clientInfo: {
      name,
      version,
    },
    deviceInfo: {
      name: Device.deviceName,
      id: getDeviceId(),
    },
  }),
}));

// can be used for initial setup with username/password
export const createApi = ({ serverAddress }: { serverAddress: string }) =>
  useApi.setState((state) => ({
    ...state,
    api: state.jellyfin.createApi(serverAddress),
  }));

// can be used if a token is already available on the device
export const createApiWithToken = ({
  serverAddress,
  token,
}: {
  serverAddress: string;
  token: string;
}) =>
  useApi.setState((state) => ({
    ...state,
    api: state.jellyfin.createApi(serverAddress, token),
  }));

export const rmApi = () =>
  useApi.setState((state) => ({
    ...state,
    api: null,
  }));
