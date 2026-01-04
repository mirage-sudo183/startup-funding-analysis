import { DollarSign, Building2, TrendingUp, Layers } from 'lucide-react';
import type { FundingRecord } from '../../types/funding';
import { formatCurrency } from '../../lib/formatters';
import { getTotalFunding, getAverageDealSize, groupByField } from '../../lib/aggregators';

interface SummaryGridProps {
  data: FundingRecord[];
  totalData: FundingRecord[];
}

export function SummaryGrid({ data, totalData }: SummaryGridProps) {
  const totalFunding = getTotalFunding(data);
  const dealCount = data.length;
  const avgDealSize = getAverageDealSize(data);
  const topVertical = groupByField(data, 'Vertical')[0];

  const cards = [
    {
      title: 'Total Funding',
      value: formatCurrency(totalFunding),
      subtitle: `of ${formatCurrency(getTotalFunding(totalData))} total`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Deal Count',
      value: dealCount.toLocaleString(),
      subtitle: `of ${totalData.length} total deals`,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Avg Deal Size',
      value: formatCurrency(avgDealSize),
      subtitle: 'per round',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Top Vertical',
      value: topVertical?.name || 'N/A',
      subtitle: topVertical ? formatCurrency(topVertical.value) : '',
      icon: Layers,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
            </div>
            <div className={`${card.color} p-2 rounded-lg`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
