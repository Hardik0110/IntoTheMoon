
import { useQuery, } from '@tanstack/react-query';
import { 
  CoinGeckoResponse, 
  SearchResult, 
  SortOption, 
  CoinDetails 
} from "@/lib/types";

export const searchCoins = async (query: string): Promise<SearchResult> => {
  if (!query) return { coins: [] };

  const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': 'CG-4PWJabzm45BiqTTxFHaW2kcJ'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network response was not ok'); 
    return response.json();
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
}

export const fetchCoins = async (
  page = 1, 
  perPage = 50, 
  sortBy?: SortOption, 
  sortDirection?: 'asc' | 'desc'
): Promise<CoinGeckoResponse[]> => {
  const order = sortBy 
    ? `${sortDirection === 'asc' ? '' : '-'}${sortBy}`
    : 'market_cap_desc';
  
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order,
    per_page: perPage.toString(),
    page: page.toString(),
    sparkline: 'true',
    price_change_percentage: '1h,24h,7d,30d',
  });

  return fetch(`https://api.coingecko.com/api/v3/coins/markets?${params}`, {
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': 'CG-4PWJabzm45BiqTTxFHaW2kcJ'
    }
  }).then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  });
};

export const fetchCoinDetails = async (coinId: string): Promise<CoinDetails> => {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': 'CG-4PWJabzm45BiqTTxFHaW2kcJ'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw error;
  }
};

export const fetchGlobalData = async (): Promise<number> => {
  const url = 'https://api.coingecko.com/api/v3/global';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': 'CG-4PWJabzm45BiqTTxFHaW2kcJ'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data.active_cryptocurrencies;
  } catch (error) {
    console.error('Error fetching global data:', error);
    throw error;
  }
};


export const useSearchCoins = (query: string) => {
  return useQuery({
    queryKey: ['coinSearch', query],
    queryFn: () => searchCoins(query),
    enabled: !!query, 
    staleTime: 5 * 60 * 1000, 
  });
};

export const useCoins = (
  page: number = 1,
  perPage: number = 50,
  sortBy?: SortOption,
  sortDirection?: 'asc' | 'desc'
) => {
  return useQuery({
    queryKey: ['coins', page, perPage, sortBy, sortDirection],
    queryFn: () => fetchCoins(page, perPage, sortBy, sortDirection),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000, 
  });
};

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
