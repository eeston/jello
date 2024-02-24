import { generateTrackUrl } from "./generateTrackUrl";

describe("generateTrackUrl", () => {
  it("should generate a track URL", () => {
    const trackId = "123";
    const userId = "456";
    const api = {
      accessToken: "token",
      deviceInfo: { id: "device" },
      basePath: "http://jellylols.com",
    };

    const url = generateTrackUrl({ trackId, api, userId });

    expect(url).toEqual(
      "http://jellylols.com/Audio/123/universal?userId=456&api_key=token&deviceId=device&TranscodingProtocol=http&TranscodingContainer=aac&AudioCodec=aac&Container=mp3%252Caac%252Cm4a%257Caac%252Cm4b%257Caac%252Cflac%252Calac%252Cm4a%257Calac%252Cm4b%257Calac%252Cwav%252Cm4a%252Caiff%252Caif",
    );
  });
});
