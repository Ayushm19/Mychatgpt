// pages/api/search.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import SerpApi from 'google-search-results-nodejs'

const search = new SerpApi.GoogleSearch(process.env.SERPAPI_API_KEY || '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const query = req.query.q as string

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter ?q=' })
  }

  if (!process.env.SERPAPI_API_KEY) {
    return res.status(500).json({ error: 'Missing SERPAPI_API_KEY in env' })
  }

  try {
    search.json(
      {
        q: query,
        location: "India",
        hl: "en",
        gl: "in",
        num: 5,
      },
      (data: any) => {
        const results = data?.organic_results?.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        })) || []

        return res.status(200).json(results)
      }
    )
  } catch (error) {
    return res.status(500).json({ error: 'Search failed', details: error })
  }
}
