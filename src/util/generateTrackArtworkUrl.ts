import { Api } from "@jellyfin/sdk";
import { ImageType } from "@jellyfin/sdk/lib/generated-client";

export const generateTrackArtworkUrl = ({
  id,
  api,
}: {
  id: string;
  api: Api;
}) => {
  const artworkUrl = api.getItemImageUrl(id, ImageType.Primary, {
    maxWidth: 512,
    quality: 90,
  });

  return artworkUrl;
};
