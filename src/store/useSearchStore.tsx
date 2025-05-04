import { timing } from "@src/theme/common";
import debounce from "lodash.debounce";
import { create } from "zustand";

interface SearchStore {
  query: string;
  resetQuery: () => void;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  resetQuery: () => set({ query: "" }),
  setQuery: debounce((value: string) => {
    set({ query: value });
  }, timing.fast),
}));
