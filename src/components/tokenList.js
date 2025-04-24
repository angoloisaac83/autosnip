// src/components/tokenList.js
import React, { useEffect, useState } from 'react';

export default function DexScreenerClone() {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    async function fetchTokenProfiles() {
      try {
        const res = await fetch("https://api.pump.fun/v1/tokens"); // Update to the Pump.fun API endpoint
        const data = await res.json();
        setTokens(data.tokens || []); // Adjust based on the actual structure of the API response
      } catch (error) {
        console.error("Failed to fetch token profiles:", error);
      }
    }

    fetchTokenProfiles();
    const interval = setInterval(fetchTokenProfiles, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Trending Tokens</h1>
      <div className="grid grid-cols-4 gap-4">
        {tokens.map((token, index) => (
          <div
            key={index}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 flex flex-col justify-between shadow-lg hover:border-gray-600 transition"
          >
            <div className="flex items-center space-x-3">
              <img
                src={token.icon || '/mnt/data/meme.png'}
                alt="icon"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-lg font-bold tracking-wider truncate">{token.name || 'Unnamed Token'}</div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-gray-400">Age: {token.age}</div>
              <div className="text-xs text-gray-400">Liquidity: {token.liquidity}</div>
              <div className="text-xs text-gray-400">Market Cap: {token.marketCap}</div>
              <div className="text-xs text-gray-400">Volume: {token.volume}</div>
            </div>
            <div className="mt-2">
              <a href={token.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}