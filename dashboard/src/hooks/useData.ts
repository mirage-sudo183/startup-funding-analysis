import { useState, useEffect } from 'react';
import type { FundingRecord } from '../types/funding';
import { loadFundingData } from '../lib/dataLoader';

interface UseDataReturn {
  data: FundingRecord[];
  loading: boolean;
  error: string | null;
}

export function useData(): UseDataReturn {
  const [data, setData] = useState<FundingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFundingData()
      .then((records) => {
        setData(records);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load data');
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
