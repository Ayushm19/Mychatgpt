// app/api/chat/ai/route.ts
export const maxDuration = 60;

import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";
import { MemoryClient } from "mem0ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const mem0 = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY!,
});

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    const body = await req.json() as {
      chatId: string;
      prompt?: string;
      fileText?: string;
      fileUrl?: string;
    };

    const { chatId, prompt, fileText, fileUrl } = body;
    const promptOrFileText = prompt || fileText || "";

    if (!userId) {
      return NextResponse.json({ success: false, message: "User not authenticated" });
    }

    if (!prompt?.trim() && !fileText?.trim()) {
      return NextResponse.json({ success: false, message: "No prompt or file content provided" });
    }

    await connectDB();

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return NextResponse.json({ success: false, message: "Chat not found" });
    }

    const userMessageToSave: Message = {
      role: "user",
      content: fileUrl?.trim() || prompt!,
      timestamp: Date.now(),
    };
    chat.messages.push(userMessageToSave);

    const systemMessage: Message = {
      role: "system",
      content: `
You're a helpful AI assistant 🤖 who can understand uploaded PDFs or images.
If the user uploads a file, its content is included below.
Respond concisely and helpfully. Add emojis where relevant 🎯✨.
Use bullet points • and numbered lists 1️⃣ 2️⃣ 3️⃣ to organize info
Start answers with a **clear heading** or title in bold or \`#\` markdown (like ChatGPT) 🏷️.
Use **section headers** (like \`## Summary\`, \`## Key Points\`) for organization 🧠 . 
Break info into **short paragraphs** and **bullet points** for readability 📌.
      `,
    };

    const userPromptMessage: Message = {
      role: "user",
      content: prompt || "",
    };

    const maxFileChars = 3000;
    const trimmedFileText = fileText?.trim().slice(0, maxFileChars);

    const fileMessage: Message | null = trimmedFileText
      ? {
          role: "user",
          content: `📎 Uploaded File Content (trimmed):\n\n${trimmedFileText}`,
        }
      : null;

    const chatHistory: Message[] = chat.messages
      .filter((msg: any) => msg.role === "user" || msg.role === "assistant")
      .slice(-10)
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

    // 🔁 Retrieve memory from Mem0
    let mem0Memory: Message[] = [];
    try {
      const memories = await mem0.search(promptOrFileText, {
        user_id: userId,
      });

      console.log("🔍 Retrieved memory from Mem0:", memories); // Debug

      mem0Memory = memories.map((item: any) => ({
      role: "system",
      content: `📌 Memory: ${item.memory}`,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch memory from Mem0:", err);
    }

    const limitedMessages: Message[] = [
      systemMessage,
      ...mem0Memory,
      ...chatHistory,
      userPromptMessage,
      ...(fileMessage ? [fileMessage] : []),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: limitedMessages,
    });

    const assistantContent = completion.choices[0].message.content;

    if (!assistantContent?.trim()) {
      return NextResponse.json({
        success: false,
        message: "AI did not return a valid response",
      });
    }

    const assistantReply: Message = {
      role: "assistant",
      content: assistantContent,
      timestamp: Date.now(),
    };

    chat.messages.push(assistantReply);
    await chat.save();

    // 💾 Store memory in Mem0 only if user said "remember"
    try {
      if (promptOrFileText.toLowerCase().includes("remember")) {
        await mem0.add(
          [
            { role: "user", content: promptOrFileText },
            { role: "assistant", content: assistantContent },
          ],
          { user_id: userId }
        );
      }
    } catch (err) {
      console.error("❌ Failed to store memory in Mem0:", err);
    }

    return NextResponse.json({ success: true, data: assistantReply });
  } catch (error: any) {
    console.error("❌ AI route error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
