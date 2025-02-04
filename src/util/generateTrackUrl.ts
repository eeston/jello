import { type Api } from "@jellyfin/sdk";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client";

export const generateTrackUrl = ({
  api,
  trackId,
  userId,
}: {
  api: Api;
  trackId: BaseItemDto["Id"];
  userId: UserDto["Id"];
}): string => {
  if (!trackId || !userId || !api) {
    // todo
    return "";
  }

  const params = new URLSearchParams({
    AudioCodec: "flac",
    Container: "flac",
    TranscodingContainer: "flac",
    TranscodingProtocol: "http",
    api_key: api?.accessToken,
    deviceId: api?.deviceInfo.id,
    userId,
  });

  const url = encodeURI(
    `${api?.basePath}/Audio/${trackId}/universal?${params.toString()}`,
  );

  return url;
};
