import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const chatData = {
      userId,
      messages: [] as any[],  // You can replace `any` with a specific message type if defined
      name: "New Chat",
    };

    await connectDB();
    await Chat.create(chatData);

    return NextResponse.json({
      success: true,
      message: "Chat created",
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
