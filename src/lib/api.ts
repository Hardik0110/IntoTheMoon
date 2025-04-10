import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  CoinGeckoResponse,
  SearchResult,
  SortOption,
  CoinDetails,
} from '@/lib/types';

const API_CONFIG = {
  baseUrl: 'https://api.coingecko.com/api/v3',
  apiKey: 'CG-4PWJabzm45BiqTTxFHaW2kcJ',
  defaultHeaders: {
    accept: 'application/json',
  }
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.defaultHeaders,
      'x-cg-demo-api-key': API_CONFIG.apiKey,
      ...options.headers,
    },
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error as Error;
      if (attempt === retries - 1) {
        console.error(`Failed to fetch ${url}:`, error);
      }
    }
  }
  throw lastError || new Error('Failed to fetch data');
}

export const searchCoins = async (query: string): Promise<SearchResult> => {
  if (!query) return { coins: [] };
  return apiRequest<SearchResult>(`/search?query=${encodeURIComponent(query)}`);
};

export const fetchCoins = async (
  page = 1,
  perPage = 50,
  sortBy?: SortOption,
  sortDirection?: 'asc' | 'desc'
): Promise<CoinGeckoResponse[]> => {
  const order = sortBy ? `${sortBy}_${sortDirection}` : 'market_cap_desc';
  
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order,
    per_page: perPage.toString(),
    page: page.toString(),
    sparkline: 'true',
    price_change_percentage: '1h,24h,7d,30d',
  });

  return apiRequest<CoinGeckoResponse[]>(`/coins/markets?${params}`);
};

export const fetchCoinDetails = async (coinId: string): Promise<CoinDetails> => {
  const coinIdMap: Record<string, string> = {
    'ripple': 'xrp',
    'bitcoin-cash': 'bch',
    'bitcoin-sv': 'bsv',
  };

  const mappedCoinId = coinIdMap[coinId.toLowerCase()] || coinId;
  const params = new URLSearchParams({
    localization: 'false',
    tickers: 'false',
    market_data: 'true',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'true'
  });

  return apiRequest<CoinDetails>(
    `/coins/${mappedCoinId}?${params}`,
    { cache: 'force-cache' }
  );
};

export const fetchGlobalData = async (): Promise<number> => {
  const response = await apiRequest<{ data: { active_cryptocurrencies: number } }>('/global');
  return response.data.active_cryptocurrencies;
};

export const useSearchCoins = (query: string) => {
  return useQuery({
    queryKey: ['coinSearch', query],
    queryFn: () => searchCoins(query),
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteCoins = (
  perPage: number = 50,
  sortBy?: SortOption,
  sortDirection?: 'asc' | 'desc'
) => {
  return useInfiniteQuery<CoinGeckoResponse[]>({
    queryKey: ['coinsInfinite', perPage, sortBy, sortDirection],
    queryFn: ({ pageParam }) => fetchCoins(pageParam as number, perPage, sortBy, sortDirection),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < perPage ? undefined : allPages.length + 1,
    initialPageParam: 1,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const createIntersectionObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  { threshold = 0.5, rootMargin = '100px' } = {}
): IntersectionObserver => {
  let isCallbackInProgress = false;

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isCallbackInProgress) {
        isCallbackInProgress = true;
        callback(entry);
      }
    });
  }, { threshold, rootMargin });
};
;

export const useCoinDetails = (coinId: string) => {
  return useQuery({
    queryKey: ['coinDetails', coinId],
    queryFn: () => fetchCoinDetails(coinId),
    enabled: !!coinId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useGlobalData = () => {
  return useQuery({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    staleTime: 5 * 60 * 1000,
  });
};

export type { CoinGeckoResponse, CoinDetails };
