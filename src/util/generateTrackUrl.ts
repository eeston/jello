import { type Api } from "@jellyfin/sdk";

export const generateTrackUrl = ({
  trackId,
  api,
  userId,
}: {
  trackId: string;
  api: Api;
  userId: string;
}): string => {
  const params = new URLSearchParams({
    userId,
    api_key: api?.accessToken,
    deviceId: api?.deviceInfo.id,
    TranscodingProtocol: "http",
    TranscodingContainer: "aac",
    AudioCodec: "aac",
    Container:
      "mp3,aac,m4a|aac,m4b|aac,flac,alac,m4a|alac,m4b|alac,wav,m4a,aiff,aif",
  });

  return encodeURI(
    `${api?.basePath}/Audio/${trackId}/universal?${params.toString()}`,
  );
};
