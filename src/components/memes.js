'use client';

import { useState, useEffect, useRef } from 'react';

export default function MemeCoins() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const intervalRef = useRef();

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meme-coins', { cache: 'no-store' });  // correct path :contentReference[oaicite:10]{index=10}
      const txt = await res.text();
      const json = txt ? JSON.parse(txt) : {};
      if (json.error) throw new Error(json.error);
      setCoins(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    intervalRef.current = setInterval(fetchCoins, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const filtered = coins.filter(t =>
    t.header.toLowerCase().includes(search.toLowerCase())
  );

  const total = Math.ceil(filtered.length / perPage);
  const slice = filtered.slice((page-1)*perPage, page*perPage);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div>Error: {error}</div>;

  return (
    <div>
      <h1>🔥 Meme Boosts ({filtered.length})</h1>
      <input
        type="search"
        placeholder="Filter…"
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />
      <table>
        <thead>
          <tr><th>#</th><th>Name</th><th>Spike</th><th>Liquidity</th><th>Link</th></tr>
        </thead>
        <tbody>
          {slice.map((t,i) => (
            <tr key={t.tokenAddress}>
              <td>{(page-1)*perPage + i + 1}</td>
              <td>{t.header}</td>
              <td>{t.amount}</td>
              <td>{t.totalAmount}</td>
              <td><a href={t.url} target="_blank">View</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
        <span>{page}/{total}</span>
        <button onClick={() => setPage(p=>Math.min(total,p+1))} disabled={page===total}>Next</button>
      </div>
    </div>
  );
}
