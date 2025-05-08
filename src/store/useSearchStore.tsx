import { timing } from "@src/theme/common";
import debounce from "lodash.debounce";
import { create } from "zustand";

interface SearchStore {
  query: string;
  resetQuery: () => void;
  setQuery: (query: string) => void;
}

// base store for search functionality
const createSearchStore = () =>
  create<SearchStore>((set) => ({
    query: "",
    resetQuery: () => set({ query: "" }),
    setQuery: debounce((value: string) => {
      set({ query: value });
    }, timing.fast),
  }));

export const useSearchPlaylistsStore = createSearchStore();
export const useSearchArtistsStore = createSearchStore();
export const useSearchAlbumsStore = createSearchStore();
export const useSearchGenresStore = createSearchStore();
export const useSearchGenreAlbumsStore = createSearchStore();
export const useSearchLibraryStore = createSearchStore();
