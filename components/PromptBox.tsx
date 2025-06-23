"use client"

import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import Image from 'next/image'
import React, { useState, KeyboardEvent, FormEvent } from 'react'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import Mem0Popover from "@/components/Mem0Popover";
import SearchDialog from "@/components/SearchDialog"

interface PromptBoxProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
}

const PromptBox: React.FC<PromptBoxProps> = ({ setIsLoading, isLoading }) => {
  const { prompt, setPrompt } = useAppContext()
  const [showUploadOptions, setShowUploadOptions] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    url: string
    extractedText: string
    type: 'pdf' | 'image'
  } | null>(null)

  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext()

  const [showSearchDialog, setShowSearchDialog] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendPrompt(e)
    }
  }

  const sendPrompt = async (e: FormEvent) => {
    e.preventDefault()
    const promptCopy = prompt

    if (!user) return toast.error('Login to send message')
    if (isLoading) return toast.error('Wait for the previous prompt response')
    if (!selectedChat) return toast.error('No chat selected')

    try {
      setIsLoading(true)
      setPrompt('')
      setUploadedFile(null)

      const userMessagesToSave: {
        role: 'user' | 'assistant';
        content: string;
        timestamp: number;
      }[] = []

      if (promptCopy.trim()) {
        userMessagesToSave.push({
          role: 'user',
          content: promptCopy.trim(),
          timestamp: Date.now(),
        })
      }

      if (uploadedFile) {
        userMessagesToSave.push({
          role: 'user',
          content: uploadedFile.url,
          timestamp: Date.now(),
        })
      }

      setChats(prev =>
        prev.map(chat =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, ...userMessagesToSave] }
            : chat
        )
      )
      setSelectedChat(prev =>
        prev ? { ...prev, messages: [...prev.messages, ...userMessagesToSave] } : null
      )

      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt: promptCopy,
        fileText: uploadedFile?.extractedText || '',
        fileUrl: uploadedFile?.url || '', // ✅ Added this to persist preview after reload
      })

      if (data.success) {
        const message = data.data
        const messageTokens = message.content.split(' ')
        let assistantMessage = {
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        }

        setChats(prev =>
          prev.map(chat =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, assistantMessage] }
              : chat
          )
        )
        setSelectedChat(prev =>
          prev ? { ...prev, messages: [...prev.messages, assistantMessage] } : null
        )

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(' ')
            setSelectedChat(prev =>
              prev
                ? {
                    ...prev,
                    messages: [...prev.messages.slice(0, -1), assistantMessage],
                  }
                : null
            )
          }, i * 100)
        }
      } else {
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    } catch (error: any) {
      toast.error(error.message)
      setPrompt(promptCopy)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeepThinkClick = () => {
    toast('🧠 DeepThink feature coming soon!', {
      icon: '✨',
    })
  }

  const handleUpload = async (type: 'pdf' | 'image') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = type === 'pdf' ? 'application/pdf' : 'image/*'

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)

      try {
        toast.loading('Uploading...')
        const res = await axios.post('/api/upload', formData)
        toast.dismiss()

        let extractedText = res.data.extracted_text || ''

        if (type === 'image' && !extractedText) {
          const Tesseract = (await import('tesseract.js')).default
          const { data: { text } } = await Tesseract.recognize(file, 'eng')
          extractedText = text
        }

        setUploadedFile({
          name: file.name,
          url: res.data.secure_url,
          extractedText,
          type,
        })

        toast.success('Uploaded successfully!')
      } catch (err) {
        console.error(err)
        toast.error('Upload failed')
      }
    }

    input.click()
    setShowUploadOptions(false)
  }

  return (
    <>
      {showUploadOptions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[#2c2e33] text-white p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-semibold">Choose file type</h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleUpload('pdf')}
                className="bg-white/10 px-4 py-2 rounded hover:bg-white/20"
              >
                📄 Upload PDF
              </button>
              <button
                onClick={() => handleUpload('image')}
                className="bg-white/10 px-4 py-2 rounded hover:bg-white/20"
              >
                🖼️ Upload Photo
              </button>
            </div>
            <button
              onClick={() => setShowUploadOptions(false)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={sendPrompt}
        className={`w-full ${
          selectedChat?.messages?.length ? 'max-w-3xl' : 'max-w-2xl'
        } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
      >
        {uploadedFile && (
          <div className="flex items-center justify-between text-xs text-muted-foreground break-all bg-[#2c2e33] px-3 py-2 rounded mb-2">
            <span className="truncate">📎 {uploadedFile.name}</span>
            <button
              type="button"
              onClick={() => setUploadedFile(null)}
              className="ml-2 hover:text-red-500"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <textarea
          onKeyDown={handleKeyDown}
          className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
          rows={2}
          placeholder="Message ChatGPT"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Image
              onClick={() => setShowUploadOptions(true)}
              className="w-4 cursor-pointer"
              src={assets.pin_icon}
              alt=""
            />
            <p 
            onClick={handleDeepThinkClick}
            className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
              <Image className="h-5" src={assets.deepthink_icon} alt="" />
              DeepThink
            </p>
            <p 
            onClick={() => {
            if (!prompt.trim()) {
              toast('✏️ Write something first')
              return
            }
            setShowSearchDialog(true)
            }}
            className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
              <Image className="h-5" src={assets.search_icon} alt="" />
              Search
            </p>
            <Mem0Popover />
          </div>

          <div className="flex items-center gap-2">
            <Image
             className="w-4 cursor-pointer"
             src={assets.mic_icon}
             alt=""
             onClick={() => toast.success('🎤 Upgrade to ChatGPT Plus for voice input!')}
            />
            <button
              type="submit"
              className={`${
                prompt || uploadedFile ? 'bg-primary' : 'bg-[#71717a]'
              } rounded-full p-2 cursor-pointer`}
            >
              <Image
                className="w-3.5 aspect-square"
                src={prompt || uploadedFile ? assets.arrow_icon : assets.arrow_icon_dull}
                alt=""
              />
            </button>
          </div>
        </div>
      </form>
      <SearchDialog
      searchQuery={prompt}
      open={showSearchDialog}
      setOpen={setShowSearchDialog}
      />
    </>
  )
}

export default PromptBox
