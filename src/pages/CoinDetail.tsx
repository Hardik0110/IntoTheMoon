
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useCoinDetails } from '@/lib/api';
import Header from '@/components/Header';
import PriceChart from '@/components/PriceChart';
import { ArrowLeft } from 'lucide-react';

const CoinDetail = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const { data: coinDetails, isLoading, isError } = useCoinDetails(coinId || '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatNumber = (num?: number) => {
    if (num === undefined) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (value?: number) => {
    if (value === undefined) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPercentageColor = (value?: number) => {
    if (value === undefined) return 'text-gray-500';
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#252D3B] text-white">
        <Header />
        <div className="container mx-auto py-16 px-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-400">Loading coin data...</p>
        </div>
      </div>
    );
  }

  if (isError || !coinDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#252D3B] text-white">
        <Header />
        <div className="container mx-auto py-16 px-4 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500">Error loading coin data</p>
          <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
            <ArrowLeft className="inline mr-1" size={16} /> Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#252D3B] text-white">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/" className="text-blue-500 hover:underline flex items-center mb-4">
            <ArrowLeft className="mr-1" size={16} /> Back to Coins
          </Link>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <img src={coinDetails.image?.large} alt={coinDetails.name} className="w-12 h-12 mr-3" />
              <h1 className="text-2xl md:text-3xl font-bold">{coinDetails.name}</h1>
              <span className="text-gray-400 text-xl ml-2 uppercase">{coinDetails.symbol}</span>
              {coinDetails.market_cap_rank && (
                <span className="ml-4 bg-[#252e3f] text-gray-300 text-sm px-2 py-1 rounded">
                  Rank #{coinDetails.market_cap_rank}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 ml-auto">
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${coinDetails.market_data?.current_price?.usd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </div>
                <div className={`text-sm ${getPercentageColor(coinDetails.market_data?.price_change_percentage_24h)}`}>
                  {formatPercentage(coinDetails.market_data?.price_change_percentage_24h)} (24h)
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
          <PriceChart 
            coinId={coinId || ''} 
            initialTimespan="7d"
          />
          </div>
          
          <div className="bg-[#1D2330]/50 rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-700">Market Stats</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Market Cap</span>
                <span className="font-medium">{formatNumber(coinDetails.market_data?.market_cap?.usd)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">24h Trading Vol</span>
                <span className="font-medium">{formatNumber(coinDetails.market_data?.total_volume?.usd)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Fully Diluted Val</span>
                <span className="font-medium">{formatNumber(coinDetails.market_data?.fully_diluted_valuation?.usd)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Circulating Supply</span>
                <span className="font-medium">
                  {coinDetails.market_data?.circulating_supply?.toLocaleString()} {coinDetails.symbol.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Total Supply</span>
                <span className="font-medium">
                  {coinDetails.market_data?.total_supply ? 
                    `${coinDetails.market_data.total_supply.toLocaleString()} ${coinDetails.symbol.toUpperCase()}` : 
                    'Unlimited'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Max Supply</span>
                <span className="font-medium">
                  {coinDetails.market_data?.max_supply ? 
                    `${coinDetails.market_data.max_supply.toLocaleString()} ${coinDetails.symbol.toUpperCase()}` : 
                    'Unlimited'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1D2330]/50 rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-medium mb-4">Price Change</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">1h</p>
                <p className={getPercentageColor(coinDetails.market_data?.price_change_percentage_1h_in_currency?.usd)}>
                  {formatPercentage(coinDetails.market_data?.price_change_percentage_1h_in_currency?.usd)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">24h</p>
                <p className={getPercentageColor(coinDetails.market_data?.price_change_percentage_24h_in_currency?.usd)}>
                  {formatPercentage(coinDetails.market_data?.price_change_percentage_24h_in_currency?.usd)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">7d</p>
                <p className={getPercentageColor(coinDetails.market_data?.price_change_percentage_7d)}>
                  {formatPercentage(coinDetails.market_data?.price_change_percentage_7d)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">30d</p>
                <p className={getPercentageColor(coinDetails.market_data?.price_change_percentage_30d)}>
                  {formatPercentage(coinDetails.market_data?.price_change_percentage_30d)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">60d</p>
                <p className={getPercentageColor(coinDetails.market_data?.price_change_percentage_60d)}>
                  {formatPercentage(coinDetails.market_data?.price_change_percentage_60d)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">1y</p>
                <p className={getPercentageColor(coinDetails.market_data?.price_change_percentage_1y)}>
                  {formatPercentage(coinDetails.market_data?.price_change_percentage_1y)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1D2330]/50 rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-medium mb-4">About {coinDetails.name}</h3>
            {coinDetails.description?.en ? (
              <div 
                className="text-sm text-gray-300 overflow-y-auto max-h-[200px] pr-2"
                dangerouslySetInnerHTML={{ __html: coinDetails.description.en.split('. ').slice(0, 5).join('. ') + '...' }}
              />
            ) : (
              <p className="text-gray-400">No description available</p>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-2">Links</h4>
              <div className="flex flex-wrap gap-2">
                {coinDetails.links?.homepage?.[0] && (
                  <a 
                    href={coinDetails.links.homepage[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Website
                  </a>
                )}
                {coinDetails.links?.blockchain_site?.[0] && (
                  <a 
                    href={coinDetails.links.blockchain_site[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-[#252e3f] text-white px-2 py-1 rounded hover:bg-[#303b52]"
                  >
                    Explorer
                  </a>
                )}
                {coinDetails.links?.subreddit_url && (
                  <a 
                    href={coinDetails.links.subreddit_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-[#FF4500] text-white px-2 py-1 rounded hover:bg-[#e03d00]"
                  >
                    Reddit
                  </a>
                )}
                {coinDetails.links?.twitter_screen_name && (
                  <a 
                    href={`https://twitter.com/${coinDetails.links.twitter_screen_name}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-[#1DA1F2] text-white px-2 py-1 rounded hover:bg-[#0d8fd9]"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
