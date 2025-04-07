
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCoins } from '@/lib/api';
import { SortOption } from '@/lib/types';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import SparklineChart from './SparklineChart';

interface CoinTableProps {
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  totalCoins: number;
}

const CoinTable = ({ page, perPage, setPage, setPerPage, totalCoins }: CoinTableProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data: coins, isLoading, isError } = useCoins(page, perPage, sortBy, sortDirection);

  const handleSort = (column: SortOption) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const renderSortIcon = (column: SortOption) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 inline" />
    );
  };

  const getPercentageColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const renderPagination = () => {
    if (!totalCoins) return null;
    
    const totalPages = Math.ceil(totalCoins / perPage);
    const currentPage = page;
    
    // Calculate the starting and ending index
    const startResultIndex = (currentPage - 1) * perPage + 1;
    const endResultIndex = Math.min(currentPage * perPage, totalCoins);
    
    // Create an array of page numbers to show
    let pageNumbers = [];
    const maxVisiblePages = 5;
    
    // Always include page 1
    pageNumbers.push(1);
    
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);
    
    if (endPage - startPage < maxVisiblePages - 2) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 2));
    }
    
    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always include the last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
        <div className="text-sm text-gray-400 mb-4 sm:mb-0">
          Showing {startResultIndex} to {endResultIndex} of {totalCoins.toLocaleString()} results
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === '...') {
                return <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</span>;
              }
              
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#252e3f] text-gray-300 hover:bg-[#2A3447]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="ml-2 bg-[#252e3f] text-gray-300 border border-gray-700 rounded px-2 py-1 text-sm"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
          </select>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-400">Loading cryptocurrency data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        <div className="text-4xl mb-4">⚠️</div>
        <p>Error loading data from CoinGecko API.</p>
        <p className="text-sm mt-2">Please try again later or check your connection.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#1D2330]">
          <tr>
            <th 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300"
              onClick={() => handleSort('market_cap_rank')}
            >
              <span className="cursor-pointer group flex items-center">#</span>
            </th>
            <th 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300"
              onClick={() => handleSort('name')}
            >
              <span className="cursor-pointer group flex items-center">
                Coin {renderSortIcon('name')}
              </span>
            </th>
            <th 
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300"
              onClick={() => handleSort('price')}
            >
              <span className="cursor-pointer group flex items-center justify-end">
                Price {renderSortIcon('price')}
              </span>
            </th>
            <th 
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300"
              onClick={() => handleSort('price_change_percentage_1h_in_currency')}
            >
              <span className="cursor-pointer group flex items-center justify-end">
                1h {renderSortIcon('price_change_percentage_1h_in_currency')}
              </span>
            </th>
            <th 
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300"
              onClick={() => handleSort('price_change_percentage_24h_in_currency')}
            >
              <span className="cursor-pointer group flex items-center justify-end">
                24h {renderSortIcon('price_change_percentage_24h_in_currency')}
              </span>
            </th>
            <th 
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300"
              onClick={() => handleSort('price_change_percentage_7d_in_currency')}
            >
              <span className="cursor-pointer group flex items-center justify-end">
                7d {renderSortIcon('price_change_percentage_7d_in_currency')}
              </span>
            </th>
            <th 
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300"
              onClick={() => handleSort('total_volume')}
            >
              <span className="cursor-pointer group flex items-center justify-end">
                24h Volume {renderSortIcon('volume')}
              </span>
            </th>
            <th 
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300"
              onClick={() => handleSort('market_cap')}
            >
              <span className="cursor-pointer group flex items-center justify-end">
                Market Cap {renderSortIcon('market_cap')}
              </span>
            </th>
            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">
              <span>Last 7 Days</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-[#1D2330]/50">
          {coins?.map((coin) => (
            <tr 
              key={coin.id}
              className="hover:bg-[#252e3f] transition-colors cursor-pointer"
            >
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                <Link to={`/coin/${coin.id}`} className="block">
                  {coin.market_cap_rank}
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <Link to={`/coin/${coin.id}`} className="flex items-center">
                  <img 
                    src={coin.image} 
                    alt={coin.name} 
                    className="w-6 h-6 mr-2"
                  />
                  <span className="font-medium text-white">{coin.name}</span>
                  <span className="text-gray-400 ml-2 uppercase">{coin.symbol}</span>
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-white">
                <Link to={`/coin/${coin.id}`} className="block">
                  ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                <Link to={`/coin/${coin.id}`} className="block">
                  <span className={getPercentageColor(coin.price_change_percentage_1h_in_currency)}>
                    {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                  </span>
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                <Link to={`/coin/${coin.id}`} className="block">
                  <span className={getPercentageColor(coin.price_change_percentage_24h_in_currency)}>
                    {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
                  </span>
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                <Link to={`/coin/${coin.id}`} className="block">
                  <span className={getPercentageColor(coin.price_change_percentage_7d_in_currency)}>
                    {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                  </span>
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-300">
                <Link to={`/coin/${coin.id}`} className="block">
                  {formatNumber(coin.total_volume)}
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-300">
                <Link to={`/coin/${coin.id}`} className="block">
                  {formatNumber(coin.market_cap)}
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                <Link to={`/coin/${coin.id}`} className="block">
                  {coin.sparkline_in_7d && (
                    <SparklineChart
                      data={coin.sparkline_in_7d.price}
                      width={120}
                      height={40}
                      lineColor={coin.price_change_percentage_7d_in_currency > 0 ? '#16C784' : '#EA3943'}
                      fillColor={coin.price_change_percentage_7d_in_currency > 0 ? '#16C784' : '#EA3943'}
                    />
                  )}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {renderPagination()}
    </div>
  );
};

export default CoinTable;
