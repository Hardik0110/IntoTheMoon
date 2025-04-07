
import { useEffect, useRef, useState } from 'react';
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
  data: number[];
  timespan?: string;
}

const PriceChart = ({ data, timespan = '7d' }: PriceChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Convert the data array to a format suitable for recharts
    const formattedData = data.map((price, index) => {
      let date = new Date();
      
      // Calculate the date based on the timespan
      switch (timespan) {
        case '7d':
          date.setDate(date.getDate() - 7 + (index / (data.length - 1) * 7));
          break;
        case '30d':
          date.setDate(date.getDate() - 30 + (index / (data.length - 1) * 30));
          break;
        default:
          date.setDate(date.getDate() - 7 + (index / (data.length - 1) * 7));
      }
      
      return {
        date: date.toLocaleDateString(),
        price: price
      };
    });
    
    setChartData(formattedData);
  }, [data, timespan]);
  
  const priceChange = data && data.length > 1 ? 
    ((data[data.length - 1] - data[0]) / data[0] * 100) : 0;
  
  const color = priceChange >= 0 ? "#16C784" : "#EA3943";
  
  return (
    <div className="bg-[#1D2330]/50 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">Price Chart</h3>
          <p className="text-sm text-gray-400">Last {timespan}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="h-64">
        {chartData.length > 0 ? (
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
            <p className="text-gray-400">Loading chart data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
