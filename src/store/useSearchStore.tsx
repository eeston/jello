import { create } from "zustand";

interface SearchStore {
  query: string;
  resetQuery: () => void;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  resetQuery: () => set({ query: "" }),
  setQuery: (query) => set({ query }),
}));
