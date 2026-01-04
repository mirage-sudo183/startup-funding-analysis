import { useMemo } from 'react';
import type { FundingRecord } from '../types/funding';
import { useFilterStore } from '../store/filterStore';
import { filterData } from '../lib/aggregators';

export function useFilteredData(data: FundingRecord[]): FundingRecord[] {
  const filters = useFilterStore();

  return useMemo(() => {
    return filterData(data, {
      verticals: filters.verticals,
      stages: filters.stages,
      regions: filters.regions,
      aiRelated: filters.aiRelated,
      fundingRange: filters.fundingRange,
      searchQuery: filters.searchQuery,
    });
  }, [
    data,
    filters.verticals,
    filters.stages,
    filters.regions,
    filters.aiRelated,
    filters.fundingRange,
    filters.searchQuery,
  ]);
}
