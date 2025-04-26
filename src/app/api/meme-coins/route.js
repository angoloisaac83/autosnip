// src/app/api/meme-coins/route.js
import { NextResponse } from 'next/server';

// Revalidate this route every 30 seconds (ISR)
export const revalidate = 30;

export async function GET() {
  try {
    // Fetch latest boosted tokens from DexScreener
    const res = await fetch('https://api.dexscreener.com/token-boosts/latest/v1', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });                                                              // :contentReference[oaicite:0]{index=0}

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `DexScreener error: ${text}` }, { status: res.status });
    }

    const boosts = await res.json();                                 // :contentReference[oaicite:1]{index=1}

    // Filter safely with optional chaining
    const memes = boosts.filter(t => {
      const h = t.header?.toLowerCase()   ?? '';
      const d = t.description?.toLowerCase() ?? '';
      return h.includes('meme') || d.includes('meme');
    });                                                              // :contentReference[oaicite:2]{index=2}

    return NextResponse.json({ data: memes });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
