export const ROW_HEIGHT = 55; // this should be in the theme
export const ARTWORK_SIZE = 250; // this should be in the theme
export const DEMO_SERVER = "https://demo.jellyfin.org/stable";

export const STORE_ACCESS_TOKEN_KEY = "dev.easton.jello.access-token";
export const STORE_SERVER_ADDRESS_KEY = "dev.easton.jello.server-address";
export const STORE_CLIENT_DEVICE_ID = "dev.easton.jello.client-device-id";
export const STORE_SELECTED_MUSIC_LIBRARY =
  "dev.easton.jello.selected-music-library-id";

/**
 * @description The number of items we should return on the home tab
 */
export const FETCH_HOME_ITEM_COUNT_LIMIT = 6;

/**
 * @description The number of recently added albums we should return on the library tab
 */
export const FETCH_LIBRARY_RECENTLY_ADDED_COUNT_LIMIT = 20;

/**
 * @description The number of top songs we should return for the artist details page
 */
export const FETCH_ARTIST_TOP_SONGS_COUNT_LIMIT = 12;

/**
 * @description The amount of times we should refetch to build data sets for frequently & recently played albums
 */
export const FETCH_REQUEST_COUNT_LIMIT = 10;

/**
 * @description The size of requests to build data sets for frequently & recently played albums
 */
export const FETCH_RECENTLY_AND_FREQUENTLY_PLAYED_BATCH_LIMIT = 20;
