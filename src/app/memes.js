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
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
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

  // Filter coins
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

  // Group filtered coins into chunks of 10 for the card layout
  const chunkSize = 10;
  const coinChunks = [];
  for (let i = 0; i < filteredCoins.length; i += chunkSize) {
    coinChunks.push(filteredCoins.slice(i, i + chunkSize));
  }

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

  // Common component for token info
  const TokenCell = ({ pair }) => (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-800 overflow-hidden">
        <img
          src={pair.info?.imageUrl || '/placeholder.svg'}
          alt={pair.baseToken?.name || 'Unknown token'}
          className="w-full h-full rounded-full object-fill"
          onError={(e) => e.target.src = '/placeholder.svg'}
        />
      </div>
      <div>
        <div className="text-white text-[13px]">{pair.baseToken?.name || 'Unknown'}</div>
        <div className="text-gray-400 text-[10px]">{pair.baseToken?.symbol || 'UNK'}</div>
      </div>
    </div>
  );

  // Common component for price change
  const PriceChangeCell = ({ value }) => (
    <span className={`${value > 0 ? "text-green-500" : "text-red-500"}`}>
      {value > 0 ? '+' : ''}{formatPercentage(value)}%
    </span>
  );

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto w-full py-4 md:py-8 sm:px-2 md:px-4">
        <h1 className="text-2xl md:text-2xl font-bold mb-4 md:mb-8 text-white">
          🔥 Live Meme Coins ({filteredCoins.length})
        </h1>
        
        {/* Filter section */}
        <section className="flex sm:flex-row flex-col w-full sm:gap-2 gap-6 justify-between items-center px-[10px] py-4">
          <div className="flex gap-4 justify-center items-center">
            <h1 className="text-xl">
              Trending
            </h1>
            <div className="flex bg-[#1c1d22] text-[15px] rounded-lg py-[3px] px-2 gap-2">
              <button className="px-[12px] py-[6px]">24h</button>
              <button className="px-[12px] py-[6px] bg-[#010101] text-[#00cc33] rounded-lg">6h</button>
              <button className="px-[12px] py-[6px]">1h</button>
              <button className="px-[12px] py-[6px]">5m</button>
            </div>
          </div>
          <div className="flex gap-2 text-[10px] sm:text-[10px] sm:w-[420px] w-[300px] overflow-x-scroll">
            <div className="relative" data-intro="instantBuy">
              <div className="flex items-stretch border border-error rounded-xl overflow-hidden bg-[#1c1d22] leading-none item-center text-grey1 cursor-pointer border-opacity-40 group hover:bg-[#30a46b] hover:bg-opacity-30">
                <label className="flex items-center px-2.5 bg-[#1c1d22] py-2 gap-1 leading-none item-center text-grey1 cursor-pointer border-opacity-40 group hover:bg-[#30a46b] hover:bg-opacity-30 border-r h-full border-error">
                  <input type="checkbox" className="h-5 w-5 accent-[#30a46b] mr-0.5" /> 
                  <span className="transition-transform duration-200 w-full origin-top-left">Instant Buy</span> 
                  <img src="https://autosnipe.ai/_app/immutable/assets/bolt-gradient.Bn7UHBy0.png" alt="bolt" height="20px" width="20px" /> 
                </label> 
                <button className="px-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 20 20" height="24px" width="24px" className="transition-transform duration-300 transform">
                    <path d="M10 12.23a.8.8 0 0 1-.28-.048.7.7 0 0 1-.247-.165L5.728 8.272a.6.6 0 0 1-.177-.435.59.59 0 0 1 .177-.443q.18-.18.44-.181c.26-.001.317.06.438.18L10 10.789l3.395-3.394a.6.6 0 0 1 .435-.177.59.59 0 0 1 .443.177q.18.18.181.439c.001.259-.06.318-.181.44l-3.745 3.744a.7.7 0 0 1-.247.165.8.8 0 0 1-.28.048"></path>
                  </svg>
                </button>
              </div> 
            </div>
            <div className="relative">
              <button id="dexesFilterDropdown" className="flex items-center gap-1 rounded-xl bg-[#1c1d22] px-4 py-2 hover:text-primary hover:bg-[#30a46b] hover:bg-opacity-30 min-w-[130px]">
                <img src="https://autosnipe.ai/_app/immutable/assets/dexes_icon.D5oEvz0a.svg" alt="dexesIcon" width="24px" height="24px" />
                Migrated From
              </button>
            </div>
            <button data-intro="filterRug" id="filterRug" className="flex items-center gap-1 rounded-xl bg-[#1c1d22] py-2 pl-3 pr-4 hover:text-primary hover:bg-[#30a46b] hover:bg-opacity-30 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" className="fill-grey2 group-hover:fill-primary">
                <path fillRule="evenodd" d="M8.73 5.75a2 2 0 0 0-.49-.81 2.3 2.3 0 0 0-1.67-.62 2.3 2.3 0 0 0-1.67.62 2.3 2.3 0 0 0-.61 1.67c0 .65.18 1.24.6 1.67a2.3 2.3 0 0 0 1.68.61 2.3 2.3 0 0 0 1.67-.6 2 2 0 0 0 .5-.82h10.12a.86.86 0 0 0 0-1.72zm5.43 5.4h4.7a.86.86 0 0 1 0 1.7h-4.7a2 2 0 0 1-.49.82 2.3 2.3 0 0 1-1.67.62 2.3 2.3 0 0 1-1.67-.62 2 2 0 0 1-.5-.81H5.15a.86.86 0 0 1 0-1.72h4.7a2 2 0 0 1 .49-.81A2.3 2.3 0 0 1 12 9.72c.65 0 1.25.18 1.67.6a2 2 0 0 1 .5.82Zm5.55 6.24a2 2 0 0 0-.6-1.67 2.3 2.3 0 0 0-1.68-.61 2.3 2.3 0 0 0-1.67.61 2 2 0 0 0-.5.82H5.15a.86.86 0 1 0 0 1.71h10.13c.1.3.26.59.49.82a2.3 2.3 0 0 0 1.67.61 2.3 2.3 0 0 0 1.67-.61 2.3 2.3 0 0 0 .61-1.68Z" clipRule="evenodd"></path>
              </svg>
              Filters
            </button>
            <button disabled data-intro="viewSetting" aria-label="token buy sell setting" className="flex items-center gap-1 rounded-xl bg-[#1c1d22] px-4 py-2 hover:text-primary hover:bg-[#30a46b] hover:bg-opacity-30 disabled:text-grey3 disabled:hover:bg-disabled">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor">
                <path fillRule="evenodd" d="M11.55 4.29h.9A1.67 1.67 0 0 1 14 5.35l.41 1.04 1.25.72 1.1-.17a1.67 1.67 0 0 1 1.7.82l.44.77a1.67 1.67 0 0 1-.14 1.88l-.7.87v1.44l.7.87a1.67 1.67 0 0 1 .14 1.88l-.45.77a1.67 1.67 0 0 1-1.7.82l-1.1-.17-1.24.72-.41 1.04a1.67 1.67 0 0 1-1.55 1.06h-.9A1.67 1.67 0 0 1 10 18.65l-.4-1.04-1.26-.72-1.1.17a1.67 1.67 0 0 1-1.7-.82l-.44-.77a1.67 1.67 0 0 1 .14-1.88l.7-.87v-1.44l-.7-.87a1.67 1.67 0 0 1-.14-1.88l.44-.77a1.67 1.67 0 0 1 1.7-.82l1.1.17 1.25-.73.41-1.03a1.67 1.67 0 0 1 1.55-1.06m2.73 7.7c0 1.47-.82 2.3-2.28 2.3s-2.28-.83-2.28-2.3c0-1.45.82-2.27 2.28-2.27s2.28.82 2.28 2.28Z" clipRule="evenodd"></path>
              </svg> 
              <span className="lg:hidden">Settings</span>
            </button>
          </div>
        </section>
        
        {/* Search and info section */}
        <div className="bg-[rgba(0,0,0,0.34)] rounded-[44px] p-2 md:p-6 mb-4 md:mb-8">
            {/* <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4 md:mb-6">
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            </div> */}

          {/* Card layout for tokens */}
          <div className="flex gap-4 w-full overflow-x-scroll">
            {coinChunks.length === 0 ? (
              <div className="col-span-full py-10 text-center text-lg text-red-400 animate-pulse bg-[#0c0d0f] rounded-[44px]">
                Error node lost, make sure your wallet is connected and substantially funded in sol at least 0.8 to 5 solana and try again
                <br />
                Note: least starting solana varies based off region some start can use at least 0.4
              </div>
            ) : (
              coinChunks.map((chunk, chunkIndex) => (
                <div key={chunkIndex} className="sm:w-fit w-[270px] bg-[#0c0d0f] rounded-[44px] p-4 h-fit">
                  {/* <h3 className="text-lg font-semibold text-white mb-4">Tokens {chunkIndex * 10 + 1} - {chunkIndex * 10 + chunk.length}</h3> */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 uppercase text-xs font-semibold">
                          <th className="px-2 py-1 text-left">Coin</th>
                          <th className="px-2 py-1 text-left">Price</th>
                          <th className="px-2 py-1 text-left">24h</th>
                          <th className="px-2 py-1 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chunk.map((item, idx) => {
                          const pair = item.pairData;
                          const globalIndex = chunkIndex * 10 + idx;
                          return (
                            <tr key={globalIndex} className="hover:bg-[rgba(0,0,0,0.95)] cursor-pointer transition-colors h-[80px]">
                              <td className="px-2 py-2">
                                <TokenCell pair={pair} />
                              </td>
                              <td className={`px-2 py-2 ${getPriceColor(pair.priceUsd)}`}>
                                ${Number(pair.priceUsd).toFixed(6)}
                              </td>
                              <td className="px-2 py-2">
                                <PriceChangeCell value={pair.priceChange?.h24} />
                              </td>
                              <td className="px-2 py-2">
                                <button
                                  className="bg-green-500 hover:bg-green-600 text-black font-medium text-xs px-2 py-1 rounded"
                                  onClick={() => handleBuyClick(item)}
                                >
                                  Buy
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
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