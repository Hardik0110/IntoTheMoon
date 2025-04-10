import { ArrowUp, ArrowDown } from 'lucide-react';
import { SortOption } from '@/lib/types';

interface CoinTableHeaderProps {
  sortBy: SortOption;
  sortDirection: 'asc' | 'desc';
  onSort: (column: SortOption) => void;
}

const CoinTableHeader = ({ sortBy, sortDirection, onSort }: CoinTableHeaderProps) => {
  const renderSortIcon = (column: SortOption) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 inline" />
    );
  };

  return (
    <thead className="bg-[#1D2330] sticky top-0 z-50">
      <tr>
      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300 bg-[#1D2330] sticky top-0 z-50 border-b border-gray-700 backdrop-blur-sm">
        <span className="cursor-pointer group flex items-center">#</span>
      </th>
        <th 
          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300 bg-[#1D2330]/95 backdrop-blur-sm"
          onClick={() => onSort('id')}
        >
          <span className="cursor-pointer group flex items-center">
            Coin {renderSortIcon('id')}
          </span>
        </th>
        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300 bg-[#1D2330]/95 backdrop-blur-sm">
          <span>Price</span>
        </th>
        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300 bg-[#1D2330]/95 backdrop-blur-sm">
          <span>1h Change</span>
        </th>
        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300 bg-[#1D2330]/95 backdrop-blur-sm">
          <span>24h Change</span>
        </th>
        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300 bg-[#1D2330]/95 backdrop-blur-sm">
          <span>7d Change</span>
        </th>
        <th 
          className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300 bg-[#1D2330]/95 backdrop-blur-sm"
          onClick={() => onSort('volume')}
        >
          <span className="cursor-pointer group flex items-center justify-end">
            24h Volume {renderSortIcon('volume')}
          </span>
        </th>
        <th 
          className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300 bg-[#1D2330]/95 backdrop-blur-sm"
          onClick={() => onSort('market_cap')}
        >
          <span className="cursor-pointer group flex items-center justify-end">
            Market Cap {renderSortIcon('market_cap')}
          </span>
        </th>
        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300 bg-[#1D2330]/95 backdrop-blur-sm">
          <span>Last 7 Days</span>
        </th>
      </tr>
    </thead>
  );
};

export default CoinTableHeader;