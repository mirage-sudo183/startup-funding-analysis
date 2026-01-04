import { useMemo } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import type { FundingRecord } from '../../types/funding';
import { useFilterStore } from '../../store/filterStore';
import { getUniqueValues } from '../../lib/aggregators';
import { formatCurrency } from '../../lib/formatters';

interface FilterPanelProps {
  data: FundingRecord[];
}

export function FilterPanel({ data }: FilterPanelProps) {
  const filters = useFilterStore();

  const uniqueVerticals = useMemo(() => getUniqueValues(data, 'Vertical'), [data]);
  const uniqueStages = useMemo(() => getUniqueValues(data, 'Stage'), [data]);
  const uniqueRegions = useMemo(() => getUniqueValues(data, 'Region'), [data]);
  const aiOptions = ['Yes', 'No', 'Partially'];

  const maxFunding = useMemo(() => {
    return Math.max(...data.map((d) => d.Round_Size_USD || 0));
  }, [data]);

  const handleCheckboxChange = (
    currentValues: string[],
    value: string,
    setter: (values: string[]) => void
  ) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter((v) => v !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => filters.setSearchQuery(e.target.value)}
            placeholder="Company, investor, location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Funding Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Funding Range
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={maxFunding}
            step={1000000}
            value={filters.fundingRange[1]}
            onChange={(e) =>
              filters.setFundingRange([filters.fundingRange[0], Number(e.target.value)])
            }
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatCurrency(filters.fundingRange[0])}</span>
            <span>{formatCurrency(filters.fundingRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Verticals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vertical ({filters.verticals.length || 'All'})
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1 bg-gray-50 p-2 rounded-lg">
          {uniqueVerticals.map((vertical) => (
            <label
              key={vertical}
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={filters.verticals.includes(vertical)}
                onChange={() =>
                  handleCheckboxChange(filters.verticals, vertical, filters.setVerticals)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{vertical}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stage ({filters.stages.length || 'All'})
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1 bg-gray-50 p-2 rounded-lg">
          {uniqueStages.map((stage) => (
            <label
              key={stage}
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={filters.stages.includes(stage)}
                onChange={() =>
                  handleCheckboxChange(filters.stages, stage, filters.setStages)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{stage}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Regions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Region ({filters.regions.length || 'All'})
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1 bg-gray-50 p-2 rounded-lg">
          {uniqueRegions.map((region) => (
            <label
              key={region}
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={filters.regions.includes(region)}
                onChange={() =>
                  handleCheckboxChange(filters.regions, region, filters.setRegions)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{region}</span>
            </label>
          ))}
        </div>
      </div>

      {/* AI Related */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Related
        </label>
        <div className="flex flex-wrap gap-2">
          {aiOptions.map((option) => (
            <button
              key={option}
              onClick={() =>
                handleCheckboxChange(filters.aiRelated, option, filters.setAiRelated)
              }
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filters.aiRelated.includes(option)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={filters.resetFilters}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Filters
      </button>
    </div>
  );
}
