import { TrendingUp, Filter } from 'lucide-react';

interface HeaderProps {
  onToggleFilters: () => void;
  showFilters: boolean;
}

export function Header({ onToggleFilters, showFilters }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Startup Funding Dashboard
            </h1>
            <p className="text-sm text-gray-500">2025 Global Funding Analysis</p>
          </div>
        </div>
        <button
          onClick={onToggleFilters}
          className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>
    </header>
  );
}
