import type { FundingRecord, AggregatedData } from '../types/funding';

export function groupByField(
  data: FundingRecord[],
  field: keyof FundingRecord
): AggregatedData[] {
  const groups = new Map<string, { value: number; count: number }>();

  data.forEach((record) => {
    const key = String(record[field]) || 'Unknown';
    const existing = groups.get(key) || { value: 0, count: 0 };
    groups.set(key, {
      value: existing.value + (record.Round_Size_USD || 0),
      count: existing.count + 1,
    });
  });

  return Array.from(groups.entries())
    .map(([name, { value, count }]) => ({ name, value, count }))
    .sort((a, b) => b.value - a.value);
}

export function getTopCompanies(
  data: FundingRecord[],
  limit: number = 20
): AggregatedData[] {
  // Group by company name (some companies have multiple rounds)
  const companyTotals = new Map<string, number>();

  data.forEach((record) => {
    const existing = companyTotals.get(record.Company) || 0;
    companyTotals.set(record.Company, existing + (record.Round_Size_USD || 0));
  });

  return Array.from(companyTotals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function getTotalFunding(data: FundingRecord[]): number {
  return data.reduce((sum, record) => sum + (record.Round_Size_USD || 0), 0);
}

export function getAverageDealSize(data: FundingRecord[]): number {
  if (data.length === 0) return 0;
  return getTotalFunding(data) / data.length;
}

export function getUniqueValues(
  data: FundingRecord[],
  field: keyof FundingRecord
): string[] {
  const values = new Set<string>();
  data.forEach((record) => {
    const value = record[field];
    if (value && typeof value === 'string') {
      values.add(value);
    }
  });
  return Array.from(values).sort();
}

export function filterData(
  data: FundingRecord[],
  filters: {
    verticals: string[];
    stages: string[];
    regions: string[];
    aiRelated: string[];
    fundingRange: [number, number];
    searchQuery: string;
  }
): FundingRecord[] {
  return data.filter((record) => {
    // Vertical filter
    if (filters.verticals.length > 0 && !filters.verticals.includes(record.Vertical)) {
      return false;
    }

    // Stage filter
    if (filters.stages.length > 0 && !filters.stages.includes(record.Stage)) {
      return false;
    }

    // Region filter
    if (filters.regions.length > 0 && !filters.regions.includes(record.Region)) {
      return false;
    }

    // AI Related filter
    if (filters.aiRelated.length > 0 && !filters.aiRelated.includes(record.AI_Related)) {
      return false;
    }

    // Funding range filter
    const funding = record.Round_Size_USD || 0;
    if (funding < filters.fundingRange[0] || funding > filters.fundingRange[1]) {
      return false;
    }

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableFields = [
        record.Company,
        record.Vertical,
        record.Sub_Vertical,
        record.Location_City,
        record.Location_Country,
        record.Lead_Investors,
      ].join(' ').toLowerCase();

      if (!searchableFields.includes(query)) {
        return false;
      }
    }

    return true;
  });
}
