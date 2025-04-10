import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalData, useSearchCoins } from '@/lib/api';
import { Search } from "lucide-react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { data: searchData, isLoading } = useSearchCoins(searchQuery);
  const { data: totalCoins } = useGlobalData();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      setIsSearchActive(true);
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#1D2330] to-[#2C3340] py-4 shadow-md sticky top-0 z-[100]">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white mr-2">2THE<span className="text-blue-500">MOON</span></span>
          </Link>
          {totalCoins && (
            <span className="text-sm text-gray-400 hidden md:block">
              Tracking {totalCoins.toLocaleString()} cryptocurrencies
            </span>
          )}
        </div>
        
        <div className="relative w-full md:w-96" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search coins..."
              className="w-full px-4 py-2 pl-10 bg-[#252e3f] border border-gray-700 rounded-lg text-gray-200 focus:out
              line-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setIsSearchActive(true)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          {isSearchActive && searchQuery && (
            <div className="absolute w-full mt-1 bg-[#252e3f] border border-gray-700 rounded-lg shadow-lg z-[101] max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-400">Searching...</div>
              ) : searchData?.coins && searchData.coins.length > 0 ? (
                <ul>
                  {searchData.coins.slice(0, 8).map((coin) => (
                    <li key={coin.id}>
                      <Link
                        to={`/coin/${coin.id}`}
                        className="flex items-center p-3 hover:bg-[#2A3447] transition-colors"
                        onClick={() => {
                          setIsSearchActive(false);
                          setSearchQuery('');
                        }}
                      >
                        <img src={coin.thumb} alt={coin.name} className="w-6 h-6 mr-3" />
                        <span className="text-white font-medium">{coin.name}</span>
                        <span className="text-gray-400 text-sm ml-2">{coin.symbol.toUpperCase()}</span>
                        {coin.market_cap_rank && (
                          <span className="ml-auto text-xs text-gray-400">#{coin.market_cap_rank}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-400">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
