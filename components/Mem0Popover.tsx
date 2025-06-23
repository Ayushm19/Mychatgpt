"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Mem0Dialog() {
  const [memories, setMemories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Track loading state

  useEffect(() => {
    if (!open) return;

    const fetchMemories = async () => {
      setLoading(true); // ✅ Start loading
      try {
        const res = await fetch("/api/memories");
        const data = await res.json();
        if (data.memories) setMemories(data.memories);
      } catch (err) {
        console.error("Failed to load memories", err);
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };

    fetchMemories();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="pill">🧠 Mem0</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-base mb-1">🧠 Memory capability by Mem0</DialogTitle>
        <p className="text-sm text-gray-400 mb-4">
          💡 Chat with the keyword{" "}
          <code className="bg-gray-700 px-1 py-0.5 rounded text-white text-xs">remember</code>{" "}
          to store memory.
        </p>

        <ScrollArea className="h-[300px] pr-2">
          {loading ? (
            <p className="text-sm text-gray-400 animate-pulse">⏳ Loading memories...</p>
          ) : memories.length === 0 ? (
            <p className="text-sm text-gray-400">No memories stored yet.</p>
          ) : (
            <ul className="space-y-2">
              {memories.map((mem, idx) => (
                <li
                  key={mem.id || idx}
                  className="bg-gray-800 p-3 rounded border border-gray-700 text-xs"
                >
                  <div className="font-medium text-white">📌 {mem.memory}</div>
                  {Array.isArray(mem.categories) && mem.categories.length > 0 && (
                    <div className="text-gray-400 text-[10px] mt-1">
                      🏷 {mem.categories.join(", ")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
