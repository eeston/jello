import { type Api } from "@jellyfin/sdk";
import { describe, expect, test } from "vitest";

import { generateTrackUrl } from "./generateTrackUrl";

describe.skip("generateTrackUrl", () => {
  test("should generate a track URL", () => {
    const trackId = "123";
    const userId = "456";
    const api: Api = {
      accessToken: "token",
      basePath: "http://jellylols.com",
      deviceInfo: { id: "device", name: "iPhone" },
    } as Api;

    const url = generateTrackUrl({ api, trackId, userId });

    expect(url).toEqual(
      "http://jellylols.com/Audio/123/universal?AudioCodec=aac&Container=opus%2Cwebm%7Copus%2Cts%7Cmp3%2Cmp3%2Caac%2Cm4a%7Caac%2Cm4b%7Caac%2Cflac%2Cwebma%2Cwebm%7Cwebma%2Cwav%2Cogg&DeviceId=device&EnableAudioVbrEncoding=false&EnableRedirection=false&EnableRemoteMedia=false&MaxStreamingBitrate=256000&StartTimeTicks=0&TranscodingContainer=mp4&TranscodingProtocol=hls&UserId=456&api_key=token",
    );
  });
});
