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
      "opus,webm|opus,ts|mp3,mp3,aac,m4a|aac,m4b|aac,flac,webma,webm|webma,wav,ogg",
    DeviceId: api?.deviceInfo.id,
    EnableAudioVbrEncoding: "false",
    EnableRedirection: "false",
    EnableRemoteMedia: "false",
    MaxStreamingBitrate: "256000",
    StartTimeTicks: "0",
    TranscodingContainer: "mp4",
    TranscodingProtocol: "hls",
    UserId: userId,
    api_key: api?.accessToken,
  });

  const url = `${api?.basePath}/Audio/${trackId}/universal?${params.toString()}`;

  return url;
};
