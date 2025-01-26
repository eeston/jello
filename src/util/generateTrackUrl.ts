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
    AudioCodec: "aac",
    Container:
      "mp3,aac,m4a|aac,m4b|aac,flac,alac,m4a|alac,m4b|alac,wav,m4a,aiff,aif",
    TranscodingContainer: "aac",
    TranscodingProtocol: "http",
    api_key: api?.accessToken,
    deviceId: api?.deviceInfo.id,
    userId,
  });

  return encodeURI(
    `${api?.basePath}/Audio/${trackId}/universal?${params.toString()}`,
  );
};
