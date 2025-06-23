"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog"
import { searchWeb } from "@/lib/serpapi"

interface SearchDialogProps {
  searchQuery: string
  open: boolean
  setOpen: (v: boolean) => void
}

export default function SearchDialog({ searchQuery, open, setOpen }: SearchDialogProps) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    searchWeb(searchQuery)
      .then(res => setResults(res))
      .catch(err => setError(String(err)))
      .finally(() => setLoading(false))
  }, [open, searchQuery])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto sm:rounded-xl p-4 sm:p-6"
      >
        <DialogTitle>Search results for "{searchQuery}"</DialogTitle>
        <DialogDescription>
          Showing top results powered by SerpAPI.
        </DialogDescription>

        {loading && <p className="mt-4 text-sm">Loading...</p>}
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        {!loading && !error && (
          <ul className="space-y-4 mt-4">
            {results.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {item.title}
                </a>
                <p className="text-sm text-gray-600">{item.snippet}</p>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
