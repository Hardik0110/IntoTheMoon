
import { useState } from 'react';
import Header from '@/components/Header';
import CoinTable from '@/components/CoinTable';
import { useGlobalData } from '@/lib/api';

const Index = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const { data: totalCoins } = useGlobalData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#252D3B] text-white">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Cryptocurrency Prices by Market Cap</h1>
          <p className="text-gray-400">
            The global cryptocurrency market cap today is valued at over $1 trillion. Explore and discover the world 
            of cryptocurrencies with real-time price data and market statistics.
          </p>
        </div>
        <div className="bg-[#1D2330] rounded-lg shadow-lg p-4 overflow-hidden">
          <CoinTable 
            page={page}
            perPage={perPage}
            setPage={setPage}
            setPerPage={setPerPage}
            totalCoins={totalCoins || 0}
          />
        </div>
      </div>
      <footer className="bg-[#1D2330] py-6 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400 text-sm">
            Data provided by CoinGecko API • {new Date().getFullYear()} • CoinVista
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
