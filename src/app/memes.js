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

  // Fetch meme coins data with improved error handling
  const fetchMemeCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/meme-coins");
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate and normalize the data structure
      const normalizedData = (data.data || []).map(item => {
        if (!item?.pairData) {
          return {
            ...item,
            pairData: {
              priceUsd: 0,
              priceChange: { h24: 0 },
              liquidity: { usd: 0 },
              volume: { h24: 0 },
              baseToken: {
                name: 'Unknown',
                symbol: 'UNK',
                address: ''
              },
              info: {
                imageUrl: '/placeholder.svg',
                websites: []
              },
              url: ''
            }
          };
        }
        
        return {
          ...item,
          pairData: {
            ...item.pairData,
            priceUsd: item.pairData.priceUsd || 0,
            priceChange: {
              h24: item.pairData.priceChange?.h24 || 0,
            },
            liquidity: {
              usd: item.pairData.liquidity?.usd || 0,
            },
            volume: {
              h24: item.pairData.volume?.h24 || 0,
            },
            baseToken: {
              ...item.pairData.baseToken,
              name: item.pairData.baseToken?.name || 'Unknown',
              symbol: item.pairData.baseToken?.symbol || 'UNK',
              address: item.pairData.baseToken?.address || '',
            },
            info: {
              ...item.pairData.info,
              imageUrl: item.pairData.info?.imageUrl || '/placeholder.svg',
              websites: item.pairData.info?.websites || [],
            },
            url: item.pairData.url || ''
          }
        };
      });
      
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

    // Check for existing wallet connection
    const walletData = localStorage.getItem('walletData');
    if (walletData) {
      const { name, address } = JSON.parse(walletData);
      setConnectedWallet(name);
      setWalletAddress(address);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Wallet connection handler
  const handleWalletConnected = (wallet) => {
    setConnectedWallet(wallet.name);
    setWalletAddress(wallet.address);
    setIsWalletModalOpen(false);
    toast.success(`Connected to ${wallet.name} successfully!`);
  };

  // Buy button click handler
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
        {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  // Filter and pagination logic
  const filteredCoins = coins.filter(coin => {
    const pair = coin?.pairData;
    if (!pair) return false;
    return (
      pair.baseToken?.address?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pair.baseToken?.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pair.baseToken?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);
  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const formatPercentage = (num) => {
    if (num === undefined || num === null) return '0.00';
    return Math.abs(num).toFixed(2);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="container max-[500px]:w-[430px] max-[500px]:hidden mx-auto w-full py-8 px-4">
        <ToastContainer />
        <h1 className="text-3xl font-bold mb-8 text-white">
          🔥 Live Meme Coins ({filteredCoins.length})
          <div className="lg:mb-6 pt-[60px] lg:pt-0 flex items-center gap-4">
            <div className="bg-secondaryDark lg:bg-highlighterBg max-[500px]:items-start px-3 py-2 pb-4 lg:pb-2 lg:flex justify-between items-center text-xl lg:rounded-lg relative">
              <div className="lg:flex gap-4 items-center">
                <div className="flex gap-1 items-center mb-3 lg:mb-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="var(--color-success)" viewBox="0 0 16 16" height="24px" width="24px">
                    <path fillRule="evenodd" d="M11.77 7.56c.51 1.19.5 2.32-.14 2.96-1.03 1.03-3.29.45-5.04-1.3C4.84 7.45 4.25 5.2 5.3 4.17c.69-.7 1.94-.65 3.22-.02l.3-.4c-1.88-1-3.85-1.04-4.97.08-1.53 1.54-.91 4.64 1.39 6.93 2.3 2.3 5.4 2.92 6.93 1.39 1.14-1.15 1.09-3.17.02-5.08l-.41.48Z" clipRule="evenodd"></path>
                    <path d="M9.31 6.71H8.3a.26.26 0 0 1-.25-.15.25.25 0 0 1 .01-.28l2.22-3.14c.05-.06.1-.1.18-.12a.34.34 0 0 1 .22 0 .3.3 0 0 1 .17.14c.03.06.04.13.03.2l-.25 2.02h1.26c.12 0 .2.06.26.16.05.1.03.2-.05.3L9.64 8.7a.32.32 0 0 1-.39.09.34.34 0 0 1-.15-.13.3.3 0 0 1-.04-.2L9.3 6.7Z"></path>
                  </svg>
                  Try our filters for a secure experience
                </div>
                <div className="flex gap-4 leading-[1.1] justify-between">
                  <div className="flex gap-4 lg:flex-row flex-col w-1/2 lg:w-auto">
                    <label className="flex items-center gap-2 cursor-pointer font-medium group">
                      <input type="checkbox" className="h-4 w-4 accent-highlight flex-shrink-0" /> 
                      <div className="text-grey1 text-xs group-hover:brightness-125 group-active:brightness-75 flex items-center gap-0.5 select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="var(--color-error)" viewBox="0 0 16 16" className="h-4 lg:h-5 w-4 lg:w-5" height="20px" width="20px">
                          <path fillRule="evenodd" d="M11.77 7.56c.51 1.19.5 2.32-.14 2.96-1.03 1.03-3.29.45-5.04-1.3C4.84 7.45 4.25 5.2 5.3 4.17c.69-.7 1.94-.65 3.22-.02l.3-.4c-1.88-1-3.85-1.04-4.97.08-1.53 1.54-.91 4.64 1.39 6.93 2.3 2.3 5.4 2.92 6.93 1.39 1.14-1.15 1.09-3.17.02-5.08l-.41.48Z" clipRule="evenodd"></path>
                          <path d="M9.31 6.71H8.3a.26.26 0 0 1-.25-.15.25.25 0 0 1 .01-.28l2.22-3.14c.05-.06.1-.1.18-.12a.34.34 0 0 1 .22 0 .3.3 0 0 1 .17.14c.03.06.04.13.03.2l-.25 2.02h1.26c.12 0 .2.06.26.16.05.1.03.2-.05.3L9.64 8.7a.32.32 0 0 1-.39.09.34.34 0 0 1-.15-.13.3.3 0 0 1-.04-.2L9.3 6.7Z"></path>
                        </svg> Hide Scams
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium group">
                      <input type="checkbox" className="h-4 w-4 accent-highlight flex-shrink-0" /> 
                      <div className="text-grey1 text-xs group-hover:brightness-125 group-active:brightness-75 flex items-center gap-0.5 select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="var(--color-warning)" viewBox="0 0 16 16" className="h-4 lg:h-5 w-4 lg:w-5" height="20px" width="20px">
                          <path fillRule="evenodd" d="M11.77 7.56c.51 1.19.5 2.32-.14 2.96-1.03 1.03-3.29.45-5.04-1.3C4.84 7.45 4.25 5.2 5.3 4.17c.69-.7 1.94-.65 3.22-.02l.3-.4c-1.88-1-3.85-1.04-4.97.08-1.53 1.54-.91 4.64 1.39 6.93 2.3 2.3 5.4 2.92 6.93 1.39 1.14-1.15 1.09-3.17.02-5.08l-.41.48Z" clipRule="evenodd"></path>
                          <path d="M9.31 6.71H8.3a.26.26 0 0 1-.25-.15.25.25 0 0 1 .01-.28l2.22-3.14c.05-.06.1-.1.18-.12a.34.34 0 0 1 .22 0 .3.3 0 0 1 .17.14c.03.06.04.13.03.2l-.25 2.02h1.26c.12 0 .2.06.26.16.05.1.03.2-.05.3L9.64 8.7a.32.32 0 0 1-.39.09.34.34 0 0 1-.15-.13.3.3 0 0 1-.04-.2L9.3 6.7Z"></path>
                        </svg> Hide Rugs
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-4 lg:flex-row flex-col w-1/2 lg:w-auto">
                    <label className="flex items-center gap-2 cursor-pointer font-medium group">
                      <input type="checkbox" className="h-4 w-4 accent-highlight flex-shrink-0" /> 
                      <span className="text-grey1 text-xs group-hover:brightness-125 group-active:brightness-75 select-none">Mint Auth Disabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium group">
                      <input type="checkbox" className="h-4 w-4 accent-highlight flex-shrink-0" /> 
                      <span className="text-grey1 text-[8px] group-hover:brightness-125 group-active:brightness-75 select-none">Freeze Auth Disabled</span>
                    </label>
                  </div>
                </div>
                <button data-intro="filterRug_mobile" id="filterRug_mobile" className="font-bold text-grey1 hover:brightness-125 active:brightness-75 mt-4 text-sm lg:mt-0">+ All Filters</button>
              </div>
              <button className="text-grey3 text-xs py-1 px-2 hover:text-grey2 active:text-grey4 top-1 absolute lg:static right-1">
                <span className="hidden lg:block text-lg">HIDE</span>
                <span className="lg:hidden text-2xl leading-none">×</span>
              </button>
            </div>
          </div>
        </h1>

        <div className="bg-[rgba(0,0,0,0.34)] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
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
            <table className="w-full text-sm">
              <thead className="">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Coin</th>
                  <th className="px-4 py-2">Price (USD)</th>
                  <th className="px-4 py-2">24h Change</th>
                  <th className="px-4 py-2">Liquidity (USD)</th>
                  <th className="px-4 py-2">Volume (24h)</th>
                  <th className="px-4 py-2">Links</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-lg text-red-400 animate-pulse">
                      Error node lost, make sure your wallet is connected and substantially funded in sol at least 0.8 to 5 solana and try again 
                      <br />
                      Note: least starting solana varies based off region some start can use at least 0.4
                    </td>
                  </tr>
                ) : (
                  currentCoins.map((item, idx) => {
                    if (!item?.pairData) return null;
                    const pair = item.pairData;

                    return (
                      <tr key={idx} className="text-center hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-2 text-gray-400">{indexOfFirstCoin + idx + 1}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
                              <img
                                src={pair.info?.imageUrl || '/placeholder.svg'}
                                alt={pair.baseToken?.name || 'Unknown token'}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <div>
                              <div className="font-medium text-white">{pair.baseToken?.name || 'Unknown'}</div>
                              <div className="text-gray-400 text-xs">{pair.baseToken?.symbol || 'UNK'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-white">
                          ${Number(pair.priceUsd || 0).toFixed(6)}
                        </td>
                        <td className={`px-4 py-2 ${
                          (pair.priceChange?.h24 || 0) > 0 ? "text-green-500" : "text-red-500"
                        }`}>
                          {(pair.priceChange?.h24 || 0) > 0 ? '+' : ''}
                          {formatPercentage(pair.priceChange?.h24 || 0)}%
                        </td>
                        <td className="px-4 py-2 text-white">
                          ${(pair.liquidity?.usd || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-white">
                          ${(pair.volume?.h24 || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 space-x-2">
                          {pair.info?.websites?.[0]?.url && (
                            <a
                              href={pair.info.websites[0].url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Website
                            </a>
                          )}
                          {pair.url && (
                            <a
                              href={pair.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Dex
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <button 
                            className="bg-green-500 hover:bg-green-600 text-black font-medium text-xs px-3 py-1 rounded"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700"
                  >
                    Prev
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        <WalletModal 
          isOpen={isWalletModalOpen} 
          onClose={closeWalletModal}
          onWalletConnected={handleWalletConnected}
        />
      </div>
      <div className="container hidden max-[500px]:flex flex-col max-[500px]:w-[430px] mx-auto w-full py-4 px-2">
        <ToastContainer />
        <h1 className="text-2xl font-bold mb-4 text-white px-2">
          🔥 Trending
        </h1>

        {/* Mobile View */}
        <div className="block md:hidden">
          <div className="mb-4 px-2">
            <div className="relative">
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
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 px-2">
            {filteredCoins.length === 0 ? (
              <div className="w-[300px] text-red-400 mx-auto py-8 text-center animate-pulse">
                Error node lost, make sure your wallet is connected and substantially funded in sol at least 0.8 to 5 solana and try again 
                <br />
                <br />
                Note: least starting solana varies based off region some start can use at least 0.4
              </div>
            ) : (
              currentCoins.map((item, idx) => {
                if (!item?.pairData) return null;
                const pair = item.pairData;

                return (
                  <div key={idx} className="bg-[rgba(0,0,0,0.34)] rounded-lg p-4 border border-gray-700">
                    {/* Token Name and Address */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-white">{pair.baseToken?.name || 'Unknown'}</div>
                        <div className="text-gray-400 text-xs">{pair.baseToken?.symbol || 'UNK'}</div>
                      </div>
                      <div className="text-gray-400 text-xs text-right">
                        {pair.baseToken?.address ? `${pair.baseToken.address.slice(0, 4)}...${pair.baseToken.address.slice(-4)}` : 'N/A'}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-700 my-2"></div>

                    {/* Stats Row 1 */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 pt-2">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={pair.info?.imageUrl || '/placeholder.svg'}
                          alt={pair.baseToken?.name || 'Token'}
                        />
                        <div className="text-gray-400 text-xs">Time</div>
                        <div className="text-white text-sm">1mo</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Price</div>
                        <div className="text-white text-sm">${Number(pair.priceUsds).toFixed(6)}</div>
                      </div>
                    </div>

                    {/* Stats Row 2 */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div>
                        <div className="text-gray-400 text-xs">MC</div>
                        <div className="text-white text-sm">${((pair.liquidity?.usd || 0) / 1000000).toFixed(2)}M</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Liquidity</div>
                        <div className="text-white text-sm">${((pair.liquidity?.usd || 0) / 1000000).toFixed(2)}M</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Txs</div>
                        <div className="text-white text-sm">{((pair.volume?.h24 || 0) / 1000).toFixed(2)}K</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                      <button className="text-gray-400 hover:text-white text-xs">
                        MAD
                      </button>
                      <button className="text-gray-400 hover:text-white text-xs">
                        LE
                      </button>
                      <button className="text-gray-400 hover:text-white text-xs">
                        FAD
                      </button>
                      <button 
                        className="bg-green-500 hover:bg-green-600 text-black font-medium text-xs px-3 py-1 rounded"
                        onClick={() => handleBuyClick(item)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* Pagination for mobile */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 px-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700 text-sm"
                >
                  Prev
                </button>
                
                <span className="text-white text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
