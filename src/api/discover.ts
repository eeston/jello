import { useAuth } from "@src/store/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useDiscoverJellyfinServers = () => {
  const { createApi, jellyfin } = useAuth();

  return useMutation({
    mutationFn: async (url: string) => {
      const servers =
        await jellyfin.discovery.getRecommendedServerCandidates(url);

      if (servers.length === 0) {
        throw new Error("No servers found");
      }

      const best = jellyfin.discovery.findBestServer(servers);
      if (!best) {
        throw new Error("No suitable server found");
      }

      return best.address;
    },
    onError: (error) => {
      console.log({ error });
      Alert.alert(
        "Server Error",
        error instanceof Error
          ? error.message
          : "Error finding server. Try again?",
      );
    },
    onSuccess: (serverAddress) => {
      createApi({ serverAddress });
    },
  });
};
