import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SummaryGrid } from '../cards/SummaryGrid';
import { TopCompaniesByFunding } from '../charts/TopCompaniesByFunding';
import { FundingByVertical } from '../charts/FundingByVertical';
import { FundingByStage } from '../charts/FundingByStage';
import { FundingByRegion } from '../charts/FundingByRegion';
import { FundingDataTable } from '../table/FundingDataTable';
import { useData } from '../../hooks/useData';
import { useFilteredData } from '../../hooks/useFilteredData';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const [showFilters, setShowFilters] = useState(false);
  const { data, loading, error } = useData();
  const filteredData = useFilteredData(data);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading funding data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />
      <div className="flex">
        <Sidebar
          data={data}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
        />
        <main className="flex-1 p-6 overflow-auto">
          <SummaryGrid data={filteredData} totalData={data} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <TopCompaniesByFunding data={filteredData} />
            <FundingByVertical data={filteredData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <FundingByStage data={filteredData} />
            <FundingByRegion data={filteredData} />
          </div>

          <div className="mt-6">
            <FundingDataTable data={filteredData} />
          </div>
        </main>
      </div>
    </div>
  );
}
