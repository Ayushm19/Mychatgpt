// lib/serpapi.ts

export async function searchWeb(query: string): Promise<any[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json()
}