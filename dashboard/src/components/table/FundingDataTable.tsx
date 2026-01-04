import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, Download } from 'lucide-react';
import type { FundingRecord } from '../../types/funding';
import { formatCurrency, truncateText } from '../../lib/formatters';

interface FundingDataTableProps {
  data: FundingRecord[];
}

export function FundingDataTable({ data }: FundingDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'Round_Size_USD', desc: true },
  ]);

  const columns = useMemo<ColumnDef<FundingRecord>[]>(
    () => [
      {
        accessorKey: 'Company',
        header: 'Company',
        cell: (info) => (
          <span className="font-medium text-gray-900">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'Round_Size_USD',
        header: 'Funding',
        cell: (info) => (
          <span className="font-semibold text-green-600">
            {formatCurrency(info.getValue<number>())}
          </span>
        ),
      },
      {
        accessorKey: 'Stage',
        header: 'Stage',
        cell: (info) => {
          const stage = info.getValue<string>();
          const colors: Record<string, string> = {
            Seed: 'bg-purple-100 text-purple-700',
            'Series A': 'bg-blue-100 text-blue-700',
            'Series B': 'bg-cyan-100 text-cyan-700',
            'Series C': 'bg-teal-100 text-teal-700',
            'Series D': 'bg-green-100 text-green-700',
            Growth: 'bg-orange-100 text-orange-700',
          };
          const colorClass = colors[stage] || 'bg-gray-100 text-gray-700';
          return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
              {stage}
            </span>
          );
        },
      },
      {
        accessorKey: 'Vertical',
        header: 'Vertical',
        cell: (info) => (
          <span className="text-gray-600">{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'Location_Country',
        header: 'Country',
        cell: (info) => (
          <span className="text-gray-600">{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'AI_Related',
        header: 'AI',
        cell: (info) => {
          const value = info.getValue<string>();
          const colors: Record<string, string> = {
            Yes: 'bg-green-100 text-green-700',
            No: 'bg-gray-100 text-gray-500',
            Partially: 'bg-yellow-100 text-yellow-700',
          };
          return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[value] || colors.No}`}>
              {value || 'No'}
            </span>
          );
        },
      },
      {
        accessorKey: 'Lead_Investors',
        header: 'Lead Investors',
        cell: (info) => (
          <span className="text-gray-600 text-sm" title={info.getValue<string>()}>
            {truncateText(info.getValue<string>() || '-', 30)}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  const exportToCsv = () => {
    const headers = columns.map((col) => col.header as string).join(',');
    const rows = data.map((record) =>
      [
        `"${record.Company}"`,
        record.Round_Size_USD,
        record.Stage,
        record.Vertical,
        record.Location_Country,
        record.AI_Related,
        `"${record.Lead_Investors}"`,
      ].join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'funding_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          All Funding Rounds ({data.length})
        </h3>
        <button
          onClick={exportToCsv}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length
          )}{' '}
          of {data.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
