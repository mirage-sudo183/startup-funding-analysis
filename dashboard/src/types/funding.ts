export interface FundingRecord {
  Company: string;
  Round_Size_USD: number;
  Stage: string;
  Vertical: string;
  Sub_Vertical: string;
  Location_City: string;
  Location_Country: string;
  Region: string;
  AI_Related: 'Yes' | 'No' | 'Partially' | '';
  Valuation_USD: number | null;
  Lead_Investors: string;
  Date_Announced: string;
}

export interface FilterState {
  verticals: string[];
  stages: string[];
  regions: string[];
  aiRelated: string[];
  fundingRange: [number, number];
  searchQuery: string;
}

export interface AggregatedData {
  name: string;
  value: number;
  count?: number;
}
