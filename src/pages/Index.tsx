
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
      <div className="mx-auto py-8 px-4">
        <div className="bg-[#1D2330] overflow-auto p-3">
          <CoinTable 
            page={page}
            perPage={perPage}
            setPage={setPage}
            setPerPage={setPerPage}
            totalCoins={totalCoins || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
