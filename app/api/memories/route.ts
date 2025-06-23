import { NextRequest, NextResponse } from "next/server";
import { MemoryClient } from "mem0ai";
import { getAuth } from "@clerk/nextjs/server";

const mem0 = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY!,
});

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ memories: [] });
  }

  try {
    // ✅ Use a general keyword like "memory" instead of blank
    const memories = await mem0.search("memory", { user_id: userId });

    return NextResponse.json({ memories });
  } catch (error) {
    console.error("❌ Error fetching memories:", error);
    return NextResponse.json({ memories: [] });
  }
}
