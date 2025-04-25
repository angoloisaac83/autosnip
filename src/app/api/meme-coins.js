export async function GET() {
  const apiKey = 'e50d2372-7bd5-4403-927f-530feb37918b'

  try {
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=500',
      {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
          'Accept': 'application/json',
        },
        cache: 'no-store', // Make sure it's not cached
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return new Response(JSON.stringify({ error: errorData.status.error_message }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
