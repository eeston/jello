import { Api } from "@jellyfin/sdk";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api";

export const generateArtworkUrl = ({
  api,
  id,
}: {
  api?: Api;
  id: BaseItemDto["AlbumId"] | null;
}): string => {
  if (!id || !api) {
    // todo
    return "";
  }
  const artworkUrl = getImageApi(api).getItemImageUrlById(
    id,
    ImageType.Primary,
    {
      maxHeight: 1024,
      quality: 90,
    },
  );

  return artworkUrl;
};
