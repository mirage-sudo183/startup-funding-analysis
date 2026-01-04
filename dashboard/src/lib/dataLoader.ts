import Papa from 'papaparse';
import type { FundingRecord } from '../types/funding';

export async function loadFundingData(): Promise<FundingRecord[]> {
  const response = await fetch('/data/startup_funding_2025.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<FundingRecord>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value, field) => {
        if (field === 'Round_Size_USD' || field === 'Valuation_USD') {
          const num = parseFloat(value);
          return isNaN(num) ? null : num;
        }
        return value.trim();
      },
      complete: (results) => {
        const validRecords = results.data.filter(
          (record) => record.Company && record.Round_Size_USD
        );
        resolve(validRecords);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}
