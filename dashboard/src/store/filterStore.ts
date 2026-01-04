import { create } from 'zustand';
import type { FilterState } from '../types/funding';

interface FilterStore extends FilterState {
  setVerticals: (verticals: string[]) => void;
  setStages: (stages: string[]) => void;
  setRegions: (regions: string[]) => void;
  setAiRelated: (aiRelated: string[]) => void;
  setFundingRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  verticals: [],
  stages: [],
  regions: [],
  aiRelated: [],
  fundingRange: [0, 50_000_000_000],
  searchQuery: '',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setVerticals: (verticals) => set({ verticals }),
  setStages: (stages) => set({ stages }),
  setRegions: (regions) => set({ regions }),
  setAiRelated: (aiRelated) => set({ aiRelated }),
  setFundingRange: (fundingRange) => set({ fundingRange }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () => set(initialState),
}));
