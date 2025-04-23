// pages/memes.js
"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MemeCoins() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'trending', 'new'
  const coinsPerPage = 10;

  useEffect(() => {
    const fetchMemeCoins = async () => {
      try {
        const res = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              category: 'meme-token',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
            },
          }
        );
        setCoins(res.data);
        setFilteredCoins(res.data);
      } catch (err) {
        console.error('Failed to fetch meme coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemeCoins();
  }, []);

  useEffect(() => {
    let filtered = [...coins];
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(coin => 
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    
    // Apply trending/new filter
    if (filter === 'trending') {
      filtered = filtered.filter(coin => coin.price_change_percentage_24h > 5);
    } else if (filter === 'new') {
      // Assuming new coins are those with lower market cap (adjust as needed)
      filtered = filtered.sort((a, b) => b.market_cap - a.market_cap).slice(0, 30);
    }
    
    setFilteredCoins(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, coins, filter]);

  if (loading) return <p className="p-8 text-white">Loading meme coins...</p>;

  // Pagination logic
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);
  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="py-8 w-full max-[500px]:w-[350px] bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔥 Live Meme Coins</h1>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-purple-600' : 'bg-gray-800'} hover:bg-purple-700 transition`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('trending')}
            className={`px-4 py-2 rounded-lg ${filter === 'trending' ? 'bg-purple-600' : 'bg-gray-800'} hover:bg-purple-700 transition`}
          >
            Trending
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg ${filter === 'new' ? 'bg-purple-600' : 'bg-gray-800'} hover:bg-purple-700 transition`}
          >
            New
          </button>
        </div>
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or symbol..."
          className="flex-grow p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-400">
        Showing {indexOfFirstCoin + 1}-{Math.min(indexOfLastCoin, filteredCoins.length)} of {filteredCoins.length} coins
        {filter !== 'all' && ` (Filtered by ${filter})`}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg overflow-hidden">
          <thead className="bg-gray-900">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Coin</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">24h Change</th>
              <th className="py-3 px-4 text-right">Market Cap</th>
              <th className="py-3 px-4 text-right">Volume (24h)</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {currentCoins.map((coin) => (
              <tr key={coin.id} className="hover:bg-gray-900 transition">
                <td className="py-4 px-4">{coin.market_cap_rank}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                    <span className="font-medium">{coin.name}</span>
                    <span className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-medium">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td className={`py-4 px-4 text-right font-medium ${
                  coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined
                    ? coin.price_change_percentage_24h.toFixed(2) + '%'
                    : 'N/A'}
                </td>
                <td className="py-4 px-4 text-right">
                  ${coin.market_cap.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  ${coin.total_volume.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <button className='text-white bg-[#00cc33] px-[16px] rounded-md hover:bg-[grey] cursor-pointer py-[4px]'>Buy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === pageNum ? 'bg-purple-600 text-white' : 'bg-gray-900 text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}