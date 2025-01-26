import { type Api } from "@jellyfin/sdk";
import { describe, expect, test } from "vitest";

import { generateTrackUrl } from "./generateTrackUrl";

describe("generateTrackUrl", () => {
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
      "http://jellylols.com/Audio/123/universal?AudioCodec=aac&Container=mp3%252Caac%252Cm4a%257Caac%252Cm4b%257Caac%252Cflac%252Calac%252Cm4a%257Calac%252Cm4b%257Calac%252Cwav%252Cm4a%252Caiff%252Caif&TranscodingContainer=aac&TranscodingProtocol=http&api_key=token&deviceId=device&userId=456",
    );
  });
});
