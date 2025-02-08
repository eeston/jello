import { useFetchArtistDetails } from "@src/api/useFetchArtistDetails";
import { ArtistView } from "@src/components/ArtistView";
import { LoadingOverlay } from "@src/components/LoadingOverlay";
import { useAuth } from "@src/store/AuthContext";
import { extractPrimaryHash } from "@src/util/extractPrimaryHash";
import { generateArtworkUrl } from "@src/util/generateArtworkUrl";
import { useLocalSearchParams, useNavigation } from "expo-router";

export default function ArtistDetails() {
  const { id: artistId } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { api } = useAuth();
  const fetchArtistDetails = useFetchArtistDetails(api, artistId);

  if (fetchArtistDetails.isPending) {
    return <LoadingOverlay />;
  }

  // TODO: handle errors

  if (!artistId) {
    navigation.goBack();
  }

  return (
    <ArtistView
      artistId={artistId}
      artistName={fetchArtistDetails?.data?.Name}
      headerImageBlurhash={extractPrimaryHash(
        fetchArtistDetails?.data?.ImageBlurHashes,
      )}
      headerImageUrl={generateArtworkUrl({
        api,
        id: fetchArtistDetails?.data?.Id,
      })}
    />
  );
}
