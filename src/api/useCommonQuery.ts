export const useCommonQuery = {
  // TODO
};

export const QUERY_KEYS = {
  albums: {
    all: ["albums"],
    details: (id: string) => ["albums", "details", id],
    list: ["albums"],
    songs: (id: string) => ["albums", "songs", id],
  },
  artists: {
    albums: (id: string) => ["artists", "albums", id],
    details: (id: string) => ["artists", "details", id],
    list: ["artists"],
    top_songs: (id: string) => ["artists", "top_songs", id],
  },
  playlists: {
    details: (id: string) => ["playlists", "details", id],
    list: ["playlists"],
    songs: (id: string) => ["playlists", "songs", id],
  },
} as const;
