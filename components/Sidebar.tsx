'use client'

import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import { useClerk, UserButton } from '@clerk/nextjs'
import { useAppContext } from '@/context/AppContext'
import ChatLabel from './ChatLabel'

interface SidebarProps {
  expand: boolean
  setExpand: React.Dispatch<React.SetStateAction<boolean>>
}

interface Plan {
  name: string
  price: string
  features: string[]
}

const Sidebar: React.FC<SidebarProps> = ({ expand, setExpand }) => {
  const { openSignIn } = useClerk()
  const { user, chats, createNewChat } = useAppContext()

  const [openMenu, setOpenMenu] = useState<{ id: string | number; open: boolean }>({ id: 0, open: false })
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false)

  const upgradePlans: Plan[] = [
    { name: 'Starter', price: '$10/mo', features: ['Basic GPT access', 'Limited chats'] },
    { name: 'Pro', price: '$20/mo', features: ['GPT-4 access', 'Unlimited chats', 'Priority support'] },
    { name: 'Enterprise', price: '$50/mo', features: ['Team access', 'Dedicated support', 'Admin tools'] },
  ]

  return (
    <div className={`flex flex-col justify-between bg-[#181818] pt-7 transition-all z-50 h-screen max-md:absolute ${expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-visible'}`}>
      <div className='flex flex-col h-full overflow-hidden flex-1'>
        {/* Top Row - Logo & Toggle */}
        <div className={`relative flex ${expand ? "flex-row gap-10" : "justify-center group"}`}>
          <div className={`${expand ? "" : "relative group cursor-pointer"}`} onClick={() => !expand && setExpand(true)}>
            {!expand ? (
              <>
                <Image className="w-6 group-hover:opacity-0 transition-opacity duration-200" src={assets.chatgpt_icon} alt='' />
                <Image className="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" src={assets.sidebar_icon} alt='Open Sidebar' />
              </>
            ) : (
              <Image className="" src={assets.gpt_text} alt='' />
            )}
          </div>

          {expand && (
            <div className='relative overflow-visible group'>
              <div onClick={() => setExpand(false)} className='flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer'>
                <Image src={assets.sidebar_icon} alt='' className='md:hidden w-5' />
                <Image src={assets.sidebar_close_icon} alt='' className='hidden md:block w-7' />
              </div>
              <div className='absolute z-[9999] w-max left-1/2 -translate-x-1/2 top-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
                Close 
                <div className='w-3 h-3 absolute bg-black rotate-45 left-1/2 -top-1.5 -translate-x-1/2'></div>
              </div>
            </div>
          )}
        </div>

        {/* New Chat Button */}
        <div className="relative overflow-visible w-max mx-auto mt-8 group">
          <button onClick={createNewChat} className={`flex items-center justify-center cursor-pointer ${expand ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5" : "h-9 w-9 hover:bg-gray-500/30 rounded-lg"}`}>
            <Image className={expand ? 'w-6' : 'w-7'} src={expand ? assets.chat_icon : assets.chat_icon_dull} alt='' />
            {expand && <p className='text-white text font-medium'>New chat</p>}
          </button>
          <div className='absolute w-max -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
            New chat
            <div className='w-3 h-3 absolute bg-black rotate-45 left-1/2 -bottom-1.5 -translate-x-1/2'></div>
          </div>
        </div>

        {/* Search Bar */}
        {expand ? (
          <div className="relative mt-4 mb-2">
            <input
              type="text"
              id="search-chats"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 rounded bg-[#2c2e33] text-white placeholder-white/30 outline-none"
            />
            <Image src={assets.realsearch_icon} alt="Search" className="w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
        ) : (
          <div className="group relative w-max mx-auto mt-4 overflow-visible">
            <div onClick={() => setExpand(true)} className="p-2 hover:bg-gray-500/20 rounded-lg cursor-pointer">
              <Image src={assets.realsearch_icon} alt="Search" className="w-5 mx-auto" />
            </div>
            <div className="absolute w-max -left-8 -top-10 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none">
              Search
              <div className="w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5"></div>
            </div>
          </div>
        )}

        {/* Sora & GPTs Buttons */}
        {expand && (
          <div className="flex flex-col gap-1 mt-4 text-white text-sm">
            <button className="flex items-center gap-3 px-2 py-1 hover:bg-white/10 rounded-lg transition w-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 8v8l5-4-5-4z" fill="currentColor" />
              </svg>
              <span>Sora</span>
            </button>
            <button className="flex items-center gap-3 px-2 py-1 hover:bg-white/10 rounded-lg transition w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                <circle cx="9" cy="15" r="1.5" fill="currentColor" />
                <circle cx="15" cy="15" r="1.5" fill="currentColor" />
              </svg>
              <span>GPTs</span>
            </button>
          </div>
        )}

        {/* Chat List with Scroll */}
        <div className={`mt-4 text-white/25 text-sm ${expand ? "block" : "hidden"} flex-1 overflow-y-auto`}>
          <p className='my-1'>Recents</p>
          {chats
            .filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((chat, index) => (
              <ChatLabel key={index} name={chat.name} id={chat._id} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className='mt-4'>
        <div onClick={() => setShowUpgradeModal(true)} className={`flex flex-col items-start gap-1 text-white/80 text-sm p-2.5 border hover:border-yellow-400 rounded-lg cursor-pointer ${expand ? 'w-full' : 'hidden'}`}>
          <span className='font-semibold'>Upgrade your plan</span>
          <span className='text-xs text-white/40'>More access to best models</span>
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center'>
            <div className='bg-[#2c2e33] p-6 rounded-xl w-[90%] max-w-xl text-white relative'>
              <button onClick={() => setShowUpgradeModal(false)} className='absolute top-2 right-3 text-white text-lg'>&times;</button>
              <h2 className='text-xl font-semibold mb-4'>Choose a Plan</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {upgradePlans.map((plan, index) => (
                  <div key={index} className='bg-[#343540] p-4 rounded-lg border border-white/10 hover:border-white/30 transition'>
                    <h3 className='text-lg font-bold'>{plan.name}</h3>
                    <p className='text-yellow-400 font-medium'>{plan.price}</p>
                    <ul className='text-xs mt-2 space-y-1 text-white/70'>
                      {plan.features.map((f, i) => (
                        <li key={i}>- {f}</li>
                      ))}
                    </ul>
                    <button className='mt-4 w-full py-1.5 bg-blue-500 hover:bg-blue-600 text-black font-semibold rounded'>
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile or Login */}
        <div onClick={user ? undefined : () => openSignIn()} className={`flex items-center ${expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'} gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}>
          {user ? <UserButton /> : <Image src={assets.profile_icon} alt='' className='w-7' />}
          {expand && <span>My Profile</span>}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
