import axios from "axios";

export async function fetchRadioInfo({
  trackArtworkUrl,
  trackDetailsUrl,
}: {
  trackArtworkUrl: string;
  trackDetailsUrl: string;
}) {
  try {
    const [{ data: radioData }, { data: radioArtwork }] = await Promise.all([
      axios.get(trackDetailsUrl),
      axios.get(trackArtworkUrl),
    ]);

    return {
      artwork: radioArtwork,
      success: true,
      trackDetails: radioData,
    };
  } catch (error) {
    console.error("Error fetching track information:", error.message);

    return {
      artwork: null,
      error: {
        code: error.response?.status || "UNKNOWN",
        details: error.response?.data || {},
        message: error.message,
      },
      success: false,
      trackDetails: null,
    };
  }
}
