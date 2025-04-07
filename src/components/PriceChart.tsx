import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface PriceChartProps {
  coinId: string;
  initialTimespan?:  '7d' | '30d' | '90d' | '1y';
}

const fetchChartData = async (coinId: string, days: string) => {
  const interval = days === '1' ? 'hourly' : 'daily';
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`,
    {
      headers: {
        'accept': 'application/json',
        'x-cg-demo-api-key': 'CG-4PWJabzm45BiqTTxFHaW2kcJ'
      },
      cache: 'force-cache'
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.prices || !Array.isArray(data.prices)) {
    throw new Error('Invalid data format received');
  }

  return data.prices.map(([timestamp, price]: [number, number]) => ({
    date: days === '1'
      ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : new Date(timestamp).toLocaleDateString(),
    price: price
  }));
};

const PriceChart = ({ coinId, initialTimespan = '7d' }: PriceChartProps) => {
  const [timespan, setTimespan] = useState(initialTimespan);

  const daysMap = {
    '7d': '7',
    '30d': '30',
    '90d': '90',
    '1y': '365'
  };

  const { data: chartData = [], isLoading, error } = useQuery({
    queryKey: ['chartData', coinId, timespan],
    queryFn: () => fetchChartData(coinId, daysMap[timespan]),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const priceChange = chartData.length > 1 ? 
    ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price * 100) : 0;
  
  const color = priceChange >= 0 ? "#16C784" : "#EA3943";

  const timeFilters: { label: string; value: '7d' | '30d' | '90d' | '1y' }[] = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' },
  ];

  return (
    <div className="bg-[#1D2330]/50 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">Price Chart</h3>
          <p className="text-sm text-gray-400">Last {timespan}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {timeFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTimespan(value)}
              className={`px-3 py-1 rounded text-sm ${
                timespan === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#252e3f] text-gray-300 hover:bg-[#2A3447]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="text-right">
          <p className={`text-lg font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error instanceof Error ? error.message : 'Error loading chart'}</p>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#999' }}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: '#999' }}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
                width={60}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#252e3f', border: '1px solid #444', borderRadius: '4px' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`, 'Price']}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={color} 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
