"use client"

import { useState, useEffect, useRef } from "react"

export default function MemeCoins() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const coinsPerPage = 10
  const intervalRef = useRef(null)
  const apiKey = "e50d2372-7bd5-4403-927f-530feb37918b"

  // Fetch all meme coins from CoinMarketCap
  const fetchMemeCoins = async () => {
    try {
      const response = await fetch("/api/meme-coins");
      const data = await response.json();

      // Display all the coins without filtering
      const memeCoins = data.data; 
        
            setCoins(memeCoins)
            setLoading(false)
          } catch (err) {
            setError(err.message)
            setLoading(false)
          }
        }
  

  useEffect(() => {
    fetchMemeCoins()

    // Set up polling every 30 seconds
    intervalRef.current = setInterval(fetchMemeCoins, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination logic
  const indexOfLastCoin = currentPage * coinsPerPage
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin)
  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    if (num < 0.0001) {
      return parseFloat(num.toFixed(8)).toString()
    }
    if (num < 1) {
      return parseFloat(num.toFixed(6)).toString()
    }
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const formatPercentage = (num) => {
    if (num === undefined || num === null) return '0.00'
    return Math.abs(num).toFixed(2)
  }

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="container max-[500px]:w-[380px] mx-auto w-[88%] py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">🔥 Live Meme Coins ({filteredCoins.length})</h1>

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
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page when searching
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
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Coin</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">24h Change</th>
                <th className="text-right py-3 px-4">Market Cap</th>
                <th className="text-right py-3 px-4">Volume (24h)</th>
                <th className="text-right py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCoins.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-4 text-gray-400">{coin.cmc_rank || 'N/A'}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
                        <img
                          src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                          alt={coin.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/placeholder.svg'
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-1">
                          {coin.name}
                          {coin.cmc_rank <= 100 && (
                            <span className="bg-green-500 text-black text-xs px-1 rounded">Top 100</span>
                          )}
                        </div>
                        <div className="text-gray-400 text-xs">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-white font-medium">
                    ${formatNumber(coin.quote?.USD?.price)}
                  </td>
                  <td className={`py-4 px-4 text-right font-medium ${
                    coin.quote?.USD?.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {coin.quote?.USD?.percent_change_24h >= 0 ? '+' : ''}
                    {formatPercentage(coin.quote?.USD?.percent_change_24h)}%
                  </td>
                  <td className="py-4 px-4 text-right text-white">
                    ${formatNumber(coin.quote?.USD?.market_cap)}
                  </td>
                  <td className="py-4 px-4 text-right text-white">
                    ${formatNumber(coin.quote?.USD?.volume_24h)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      className="bg-green-500 hover:bg-green-600 text-black font-medium text-xs px-3 py-1 rounded"
                      onClick={() => alert(`Buy ${coin.name}`)}
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
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
                
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
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
                  )
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
    </div>
  )
}