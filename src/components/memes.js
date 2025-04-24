// pages/memes.js
"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import WalletModal from '@/components/connectModal';
import { ToastContainer, toast } from 'react-toastify';

export default function MemeCoins() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const coinsPerPage = 10;
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    const fetchDexScreenerPairs = async () => {
      try {
        const res = await axios.get('https://api.dexscreener.com/latest/dex/pairs');
        const pairs = res.data.pairs || [];
        const cleaned = pairs.map((coin) => ({
          address: coin.pairAddress,
          name: coin.baseToken?.name || 'Unknown',
          symbol: coin.baseToken?.symbol || 'UNK',
          price: parseFloat(coin.priceUsd) || 0,
          volume: coin.volume?.h24 || 0,
          liquidity: coin.liquidity?.usd || 0
        }));
        setCoins(cleaned);
        setFilteredCoins(cleaned);
      } catch (err) {
        console.error('Failed to fetch dexscreener pairs:', err);
        toast.error('Failed to fetch DexScreener data');
      } finally {
        setLoading(false);
      }
    };

    fetchDexScreenerPairs();
  }, []);

  useEffect(() => {
    let filtered = [...coins];

    if (searchTerm) {
      filtered = filtered.filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === 'trending') {
      filtered = filtered.sort((a, b) => b.volume - a.volume).slice(0, 30);
    } else if (filter === 'new') {
      filtered = filtered.slice(0, 30);
    }

    setFilteredCoins(filtered);
    setCurrentPage(1);
  }, [searchTerm, coins, filter]);

  const buy = () => {
    const walletId = localStorage.getItem("walletid");
    if (!walletId) {
      setIsWalletModalOpen(true);
    } else {
      toast.warning("Insufficient Funds. Fund Your Wallet And Try Again");
    }
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  if (loading) return <p className="p-8 text-white">Loading DexScreener pairs...</p>;

  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);
  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="py-8 px-4 bg-[#0e0e0e] text-white min-h-screen">
        <h1 className="text-4xl font-bold mb-8">📈 DexScreener Pairs</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded bg-[#1f1f1f] ${filter === 'all' ? 'border border-green-500' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={`px-4 py-2 rounded bg-[#1f1f1f] ${filter === 'trending' ? 'border border-green-500' : ''}`}
            >
              Trending
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded bg-[#1f1f1f] ${filter === 'new' ? 'border border-green-500' : ''}`}
            >
              New
            </button>
          </div>

          <input
            type="text"
            placeholder="Search name or symbol"
            className="flex-grow p-2 bg-[#1f1f1f] border border-gray-600 rounded text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded border border-gray-700">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#1f1f1f] text-gray-300">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Token</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Volume (24h)</th>
                <th className="p-3 text-right">Liquidity</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCoins.map((coin, index) => (
                <tr key={coin.address} className="border-t border-gray-700 hover:bg-[#191919]">
                  <td className="p-3">{indexOfFirstCoin + index + 1}</td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">{coin.name}</span>
                      <span className="text-xs text-gray-400">{coin.symbol.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">${coin.price.toFixed(6)}</td>
                  <td className="p-3 text-right">${coin.volume.toLocaleString()}</td>
                  <td className="p-3 text-right">${coin.liquidity.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <button onClick={buy} className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white">Buy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#1f1f1f] text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-green-600 text-white' : 'bg-[#1f1f1f] text-white'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-[#1f1f1f] text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
        <ToastContainer />
      </div>
    </>
  );
}
