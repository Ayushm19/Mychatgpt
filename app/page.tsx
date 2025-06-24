'use client';

import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import toast from 'react-hot-toast'

interface MessageType {
  role: string;
  content: string;
}

const upgradePlans = [
  {
    name: "Starter",
    price: "$10/mo",
    features: ["Basic GPT access", "Limited chats"],
  },
  {
    name: "Pro",
    price: "$20/mo",
    features: ["GPT-4 access", "Unlimited chats", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "$50/mo",
    features: ["Team access", "Dedicated support", "Admin tools"],
  },
];

export default function Home() {
  const [expand, setExpand] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const { selectedChat, createNewChat } = useAppContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();



  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleOptionClick = (value: string) => {
    setDropdownOpen(false);
    if (value === "plus") {
      setShowUpgradeModal(true);
    }
  };

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">

          {/* 🔽 Custom Dropdown */}
          <div
            className={`absolute top-4 z-30 transition-all duration-300
            md:left-4
            ${expand ? "left-1/2 -translate-x-1/2 md:translate-x-0" : "left-12 md:translate-x-0"}`}
          >
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-[#2c2e33] text-white text-sm px-4 py-2 rounded-lg border border-white/10 hover:border-white/30 w-max"
              >
                ChatGPT ▼
              </button>

              {dropdownOpen && (
                <div className="absolute mt-2 w-64 bg-[#2c2e33] border border-white/10 rounded-lg shadow-lg z-50">
                  <ul className="text-sm">
                    <li
                      onClick={() => handleOptionClick("plus")}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                    >
                      <p className="font-medium">✨ Upgrade to ChatGPT Plus</p>
                      <p className="text-xs text-gray-400">Our smartest model and more</p>
                    </li>
                    <li
                      onClick={() => handleOptionClick("chatgpt")}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                    >
                      <p className="font-medium">🚀 ChatGPT</p>
                      <p className="text-xs text-gray-400">Great for everyday tasks</p>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Upgrade Modal */}
          {showUpgradeModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
              <div className="bg-[#2c2e33] p-6 rounded-xl w-[90%] max-w-xl text-white relative">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute top-2 right-3 text-white text-lg"
                >
                  &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Choose a Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upgradePlans.map((plan, index) => (
                    <div
                      key={index}
                      className="bg-[#343540] p-4 rounded-lg border border-white/10 hover:border-white/30 transition"
                    >
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-yellow-400 font-medium">{plan.price}</p>
                      <ul className="text-xs mt-2 space-y-1 text-white/70">
                        {plan.features.map((f, i) => (
                          <li key={i}>- {f}</li>
                        ))}
                      </ul>
                      <button className="mt-4 w-full py-1.5 bg-blue-500 hover:bg-blue-600 text-black font-semibold rounded">
                        Buy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mobile topbar */}
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180"
              src={assets.menu_icon}
              alt=""
            />
            <Image
              onClick={createNewChat}
              className="opacity-70 cursor-pointer"
              src={assets.chat_icon}
              alt=""
            />
          </div>

          {/* Desktop top-right controls */}
          <div className="hidden md:flex absolute top-4 right-4 items-center gap-3 z-30">
            <button
             onClick={() => {
             const link = 'https://mychatgpt-ayusmishra-ten.vercel.app/';
             navigator.clipboard.writeText(link);
             toast.success('🔗 Link copied to clipboard!');
              }}
            className="bg-[#2c2e33] text-white text-sm px-3 py-1 rounded-lg border border-white/10 hover:border-white/30">
              Share ⏫
            </button>
            <button
              title="Open canvas"
              className="text-white text-xl hover:opacity-80"
            >
              🗎
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>

          {messages.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image src={assets.chatgpt_icon} alt="" className="w-12 h-12" />
                <p className="text-2xl font-medium">Hi, I&apos;m Chat-GPT.</p>
              </div>
              <p className="text-sm mt-2">How can I help you today?</p>
            </>
          ) : (
            <div
              ref={containerRef}
              className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
            >
              <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">
                {selectedChat?.name}
              </p>
              {messages.map((msg, index) => (
                <Message key={index} role={msg.role} content={msg.content} />
              ))}
              {isLoading && (
                <div className="flex gap-4 max-w-3xl w-full py-3">
                  <Image
                    className="h-9 w-9 p-1 border border-white/15 rounded-full"
                    src={assets.chatgpt_icon}
                    alt="Logo"
                  />
                  <div className="loader flex justify-center items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isSignedIn ? (
                    <div
                    onClick={() => {
                    toast.error("🔒 Please login to send a message.");
                    openSignIn(); // Clerk sign-in modal
                    }}
                    className="relative w-full max-w-2xl mt-4 cursor-pointer"
                    >
             {/* Real PromptBox but non-functional */}
                   <div className="pointer-events-none opacity-70">
                   <PromptBox isLoading={false} setIsLoading={() => {}} />
                   </div>

             {/* Overlay to catch click events */}
                  <div className="absolute inset-0 z-10" />
                  </div>
                  ) : (
                 <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          )}

          <p className="text-xs absolute bottom-1 text-gray-500">
            AI-can also make mistakes, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}
