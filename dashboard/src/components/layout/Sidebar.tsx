import { X } from 'lucide-react';
import { FilterPanel } from '../filters/FilterPanel';
import type { FundingRecord } from '../../types/funding';

interface SidebarProps {
  data: FundingRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ data, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-65px)] lg:h-[calc(100vh-80px)]">
          <FilterPanel data={data} />
        </div>
      </aside>
    </>
  );
}
