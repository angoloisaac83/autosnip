"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import WalletModal from '@/components/connectModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TokenTable() {
  // State variables
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const coinsPerPage = 10;
  const intervalRef = useRef(null);

  // Fetch meme coins data
  const fetchMemeCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/meme-coins");
      
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      
      const data = await response.json();
      const normalizedData = (data.data || []).map(item => ({
        ...item,
        pairData: {
          priceUsd: item.pairData?.priceUsd || 0,
          priceChange: { h24: item.pairData?.priceChange?.h24 || 0 },
          liquidity: { usd: item.pairData?.liquidity?.usd || 0 },
          volume: { h24: item.pairData?.volume?.h24 || 0 },
          baseToken: {
            name: item.pairData?.baseToken?.name || 'Unknown',
            symbol: item.pairData?.baseToken?.symbol || 'UNK',
            address: item.pairData?.baseToken?.address || '',
          },
          info: {
            imageUrl: item.pairData?.info?.imageUrl || '/placeholder.svg',
            websites: item.pairData?.info?.websites || [],
          },
          url: item.pairData?.url || ''
        }
      }));
      
      setCoins(normalizedData);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setCoins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemeCoins();
    intervalRef.current = setInterval(fetchMemeCoins, 30000);

    const walletData = localStorage.getItem('walletData');
    if (walletData) {
      const { name, address } = JSON.parse(walletData);
      setConnectedWallet(name);
      setWalletAddress(address);
    }

    return () => clearInterval(intervalRef.current);
  }, []);

  // Handlers
  const handleWalletConnected = (wallet) => {
    setConnectedWallet(wallet.name);
    setWalletAddress(wallet.address);
    setIsWalletModalOpen(false);
    toast.success(`Connected to ${wallet.name} successfully!`);
  };

  const handleBuyClick = (coin) => {
    if (!connectedWallet) {
      setIsWalletModalOpen(true);
      toast.info('Please connect your wallet to proceed with purchase');
    } else {
      toast.error(
        <div>
          <p>Insufficient SOL balance in your wallet!</p>
          <p className="text-sm">You need atleats 0.005 SOL (incl. fee) to make this purchase</p>
        </div>,
        { position: "top-right", autoClose: 8000 }
      );
    }
  };

  // Filter and pagination
  const filteredCoins = coins.filter(coin => {
    const pair = coin?.pairData;
    if (!pair) return false;
    const query = searchQuery.toLowerCase();
    return (
      pair.baseToken?.address?.toLowerCase().includes(query) || 
      pair.baseToken?.symbol?.toLowerCase().includes(query) || 
      pair.baseToken?.name?.toLowerCase().includes(query)
    );
  });

  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);
  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const formatPercentage = (num) => Math.abs(num || 0).toFixed(2);
  const getPriceColor = (price) => {
    const numericPrice = Number(price);
    if (numericPrice < 0.0001) return 'text-red-500';
    if (numericPrice < 0.001) return 'text-orange-500';
    return 'text-green-500';
  };

  const closeWalletModal = () => setIsWalletModalOpen(false);

  // Loading and error states
  if (loading) return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (error) return (
    <div className="w-full h-64 flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  );

  // Common table cell for token info
  const TokenCell = ({ pair }) => (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-800 overflow-hidden">
        <img
          src={pair.info?.imageUrl || '/placeholder.svg'}
          alt={pair.baseToken?.name || 'Unknown token'}
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = '/placeholder.svg'}
        />
      </div>
      <div>
        <div className="font-medium text-white">{pair.baseToken?.name || 'Unknown'}</div>
        <div className="text-gray-400 text-xs">{pair.baseToken?.symbol || 'UNK'}</div>
      </div>
    </div>
  );

  // Common table cell for price change
  const PriceChangeCell = ({ value }) => (
    <span className={`${value > 0 ? "text-green-500" : "text-red-500"}`}>
      {value > 0 ? '+' : ''}{formatPercentage(value)}%
    </span>
  );

  // Common pagination component
  const Pagination = ({ totalPages, currentPage, paginate }) => (
    <div className="flex justify-center mt-4 md:mt-6">
      <nav className="flex items-center gap-2">
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 md:px-4 md:py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700 text-xs md:text-sm"
        >
          Prev
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) pageNum = i + 1;
          else if (currentPage <= 3) pageNum = i + 1;
          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
          else pageNum = currentPage - 2 + i;
          
          return (
            <button
              key={pageNum}
              onClick={() => paginate(pageNum)}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm ${
                currentPage === pageNum ? 'bg-green-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 md:px-4 md:py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700 text-xs md:text-sm"
        >
          Next
        </button>
      </nav>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto w-full py-4 md:py-8 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-white">
          🔥 Live Meme Coins ({filteredCoins.length})
        </h1>
        <div className="pt-4 flex w-full items-center justify-center">
          <div className="bg-gray-900 lg:bg-gray-800 text-white rounded-lg p-4 sm:p-6 w-full max-w-4xl grid gap-4 lg:grid-cols-[auto_1fr] items-center relative">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="var(--color-success, #00cc33)"
                viewBox="0 0 16 16"
                height="24px"
                width="24px"
              >
                <path
                  fillRule="evenodd"
                  d="M11.77 7.56c.51 1.19.5 2.32-.14 2.96-1.03 1.03-3.29.45-5.04-1.3C4.84 7.45 4.25 5.2 5.3 4.17c.69-.7 1.94-.65 3.22-.02l.3-.4c-1.88-1-3.85-1.04-4.97.08-1.53 1.54-.91 4.64 1.39 6.93 2.3 2.3 5.4 2.92 6.93 1.39 1.14-1.15 1.09-3.17.02-5.08l-.41.48Z"
                  clipRule="evenodd"
                />
                <path d="M9.31 6.71H8.3a.26.26 0 0 1-.25-.15.25.25 0 0 1 .01-.28l2.22-3.14c.05-.06.1-.1.18-.12a.34.34 0 0 1 .22 0 .3.3 0 0 1 .17.14c.03.06.04.13.03.2l-.25 2.02h1.26c.12 0 .2.06.26.16.05.1.03.2-.05.3L9.64 8.7a.32.32 0 0 1-.39.09.34.34 0 0 1-.15-.13.3.3 0 0 1-.04-.2L9.3 6.7Z" />
              </svg>
              <span className="text-sm sm:text-base font-medium">
                Try our filters for a secure experience
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2 lg:mt-0">
              <label className="flex items-center gap-2 cursor-pointer font-medium group">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-green-500 focus:ring-green-500"
                />
                <span className="text-gray-400 group-hover:text-white group-active:text-gray-300 select-none text-sm">
                  Hide Scams
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium group">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-green-500 focus:ring-green-500"
                />
                <span className="text-gray-400 group-hover:text-white group-active:text-gray-300 select-none text-sm">
                  Hide Rugs
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium group">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-green-500 focus:ring-green-500"
                />
                <span className="text-gray-400 group-hover:text-white group-active:text-gray-300 select-none text-sm">
                  Mint Auth Disabled
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium group">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-green-500 focus:ring-green-500"
                />
                <span className="text-gray-400 group-hover:text-white group-active:text-gray-300 select-none text-sm">
                  Freeze Auth Disabled
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="bg-[rgba(0,0,0,0.34)] rounded-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4 md:mb-6">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search for meme coins..."
                className="block w-full pl-10 pr-3 py-2 rounded-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-white text-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>High Risk</span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Rug Protection</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {/* Desktop Table */}
<table className="w-full text-base hidden md:table border-collapse">
  <thead>
    <tr className="bg-gray-900 text-gray-400 uppercase text-sm font-semibold">
      <th className="px-6 py-4 text-left border-b border-gray-700">#</th>
      <th className="px-6 py-4 text-left border-b border-gray-700">Coin</th>
      <th className="px-6 py-4 text-left border-b border-gray-700">Price (USD)</th>
      <th className="px-6 py-4 text-left border-b border-gray-700">24h Change</th>
      <th className="px-6 py-4 text-left border-b border-gray-700">Liquidity (USD)</th>
      <th className="px-6 py-4 text-left border-b border-gray-700">Volume (24h)</th>
      <th className="px-6 py-4 text-left border-b border-gray-700">Links</th>
      <th className="px-6 py-4 text-left border-b border-gray-700">Action</th>
    </tr>
  </thead>
  <tbody>
    {filteredCoins.length === 0 ? (
      <tr>
        <td colSpan="8" className="py-10 text-center text-lg text-red-400 animate-pulse bg-gray-800">
          Error node lost, make sure your wallet is connected and substantially funded in sol at least 0.8 to 5 solana and try again
          <br />
          Note: least starting solana varies based off region some start can use at least 0.4
        </td>
      </tr>
    ) : (
      currentCoins.map((item, idx) => {
        const pair = item.pairData;
        return (
          <tr
            key={idx}
            className="hover:bg-gray-800 transition-colors border-b border-gray-600"
          >
            <td className="px-6 py-4 text-gray-400">{indexOfFirstCoin + idx + 1}</td>
            <td className="px-6 py-4">
              <TokenCell pair={pair} />
            </td>
            <td className={`px-6 py-4 text-sm ${getPriceColor(pair.priceUsd)}`}>
              ${Number(pair.priceUsd).toFixed(6)}
            </td>
            <td className="px-6 py-4 text-sm">
              <PriceChangeCell value={pair.priceChange?.h24} />
            </td>
            <td className="px-6 py-4 text-white text-sm">
              ${pair.liquidity?.usd.toLocaleString() || "0"}
            </td>
            <td className="px-6 py-4 text-white text-sm">
              ${pair.volume?.h24.toLocaleString() || "0"}
            </td>
            <td className="px-6 py-4 text-sm space-x-3">
              {pair.info?.websites?.[0]?.url && (
                <a
                  href={pair.info.websites[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 underline"
                >
                  Website
                </a>
              )}
              {pair.url && (
                <a
                  href={pair.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 underline"
                >
                  Dex
                </a>
              )}
            </td>
            <td className="px-6 py-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-black font-medium text-sm px-3 py-2 rounded-lg transition-colors"
                onClick={() => handleBuyClick(item)}
              >
                Buy
              </button>
            </td>
          </tr>
        );
      })
    )}
  </tbody>
</table>
            {/* Mobile Table */}
            <table className="w-full text-xs md:hidden">
              <thead>
                <tr>
                  <th className="px-2 py-1">#</th>
                  <th className="px-2 py-1">Coin</th>
                  <th className="px-2 py-1">Price</th>
                  <th className="px-2 py-1">24h</th>
                  <th className="px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-red-400 animate-pulse">
                      Error node lost, make sure your wallet is connected and substantially funded in sol at least 0.8 to 5 solana and try again 
                      <br />
                      Note: least starting solana varies based off region some start can use at least 0.4
                    </td>
                  </tr>
                ) : (
                  currentCoins.map((item, idx) => {
                    const pair = item.pairData;
                    return (
                      <tr key={idx} className="text-center hover:bg-gray-800 transition-colors">
                        <td className="px-2 py-1 text-gray-400">{indexOfFirstCoin + idx + 1}</td>
                        <td className="px-2 py-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-800 overflow-hidden">
                              <img
                                src={pair.info?.imageUrl || '/placeholder.svg'}
                                alt={pair.baseToken?.name || 'Unknown token'}
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = '/placeholder.svg'}
                              />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-white">{pair.baseToken?.symbol || 'UNK'}</div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-2 py-1 ${getPriceColor(pair.priceUsd)}`}>
                          ${Number(pair.priceUsd).toFixed(6)}
                        </td>
                        <td className="px-2 py-1"><PriceChangeCell value={pair.priceChange?.h24} /></td>
                        <td className="px-2 py-1">
                          <button 
                            className="bg-green-500 hover:bg-green-600 text-black font-medium text-xs px-2 py-1 rounded"
                            onClick={() => handleBuyClick(item)}
                          >
                            Buy
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <Pagination 
                totalPages={totalPages}
                currentPage={currentPage}
                paginate={paginate}
              />
            )}
          </div>
        </div>

        <WalletModal 
          isOpen={isWalletModalOpen} 
          onClose={closeWalletModal}
          onWalletConnected={handleWalletConnected}
        />
      </div>
    </>
  );
}