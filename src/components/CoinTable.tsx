import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteCoins, createIntersectionObserver } from '@/lib/api';
import { SortOption } from '@/lib/types';
import { ArrowUp, ArrowDown } from 'lucide-react';
import SparklineChart from './SparklineChart';
import CoinTableHeader from './CoinTableHeader';

interface CoinTableProps {
  perPage: number;
}

const CoinTable = ({ perPage }: CoinTableProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteCoins(perPage, sortBy, sortDirection);

  const coins = useMemo(() => data?.pages.flat() || [], [data?.pages]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastCoinRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (!node || isFetchingNextPage || !hasNextPage) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = createIntersectionObserver((entry) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleSort = (column: SortOption) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '$0.00';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };



  const getPercentageColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'text-gray-500';
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-4 text-gray-400">Loading cryptocurrency data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        <div className="text-4xl mb-4">⚠️</div>
        <p>Error loading data from CoinGecko API.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative overflow-x-auto">
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-700 border-separate">
            <CoinTableHeader sortBy={sortBy} sortDirection={sortDirection} onSort={handleSort} />
            <tbody className="divide-y divide-gray-800 bg-[#1D2330]/50">
              {coins.map((coin, index) => {
                const isNearEnd = index === coins.length - 10;
                return (
                  <tr
                    key={coin.id}
                    ref={isNearEnd ? lastCoinRef : null}
                    className="hover:bg-[#252e3f] transition-colors cursor-pointer"
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                      <Link to={`/coin/${coin.id}`} className="block">
                        {coin.market_cap_rank}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <Link to={`/coin/${coin.id}`} className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                        <span className="font-medium text-white">{coin.name}</span>
                        <span className="text-gray-400 ml-2 uppercase">{coin.symbol}</span>
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-white">
                      <Link to={`/coin/${coin.id}`} className="block">
                        {coin.current_price?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        }) || '0.00'}
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
                );
              })}
            </tbody>
          </table>
          {isFetchingNextPage && (
            <div className="py-4 text-center text-gray-400">Loading more coins...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinTable;
