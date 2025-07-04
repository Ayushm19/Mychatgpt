import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import toast from 'react-hot-toast'
import { useAppContext } from '@/context/AppContext'

interface MessageProps {
  role: 'user' | 'assistant' | string
  content: string
}

const Message: React.FC<MessageProps> = ({ role, content }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [content])

  const copyMessage = () => {
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard')
  }

  const { setPrompt } = useAppContext()

  const isImage = content.match(/^https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/i)
  const isPDF = content.match(/^https?:\/\/.*\.pdf$/i)

  return (
    <div className='flex flex-col items-center w-full max-w-3xl text-sm'>
      <div className={`flex flex-col w-full mb-8 ${role === 'user' && 'items-end'}`}>
        <div
          className={`group relative flex max-w-2xl py-3 rounded-xl ${
            role === 'user' ? 'bg-[#414158] px-5' : 'gap-3'
          }`}
        >
          <div
            className={`
                  absolute
                  transition-all
                  opacity-100 
                  sm:opacity-0 sm:group-hover:opacity-100
                  ${role === 'user' ? '-left-16 top-2.5' : 'left-9 -bottom-6'}
            `}
          >
            <div className='flex items-center gap-2 opacity-70'>
              {role === 'user' ? (
                <>
                  <Image
                    onClick={copyMessage}
                    src={assets.copy_icon}
                    alt=''
                    className='w-4 cursor-pointer'
                  />
                  <Image
                    src={assets.pencil_icon}
                    alt=''
                    className='w-4.5 cursor-pointer'
                    onClick={() => {
                    setPrompt(content)
                    toast.success("Message loaded for editing ✏️")
                   }}
                  />
                </>
              ) : (
                <>
                  <Image
                    onClick={copyMessage}
                    src={assets.copy_icon}
                    alt=''
                    className='w-4.5 cursor-pointer'
                  />
                  <Image
                    src={assets.regenerate_icon}
                    alt=''
                    className='w-4 cursor-pointer'
                  />
                  <Image
                    src={assets.like_icon}
                    alt=''
                    className='w-4 cursor-pointer'
                  />
                  <Image
                    src={assets.dislike_icon}
                    alt=''
                    className='w-4 cursor-pointer'
                  />
                </>
              )}
            </div>
          </div>

          {/* 👇 Render image or PDF preview if content is a Cloudinary link */}
          {role === 'user' && (isImage || isPDF) ? (
            isImage ? (
              <Image
                src={content}
                alt='Uploaded image'
                width={300}
                height={300}
                className='max-w-xs rounded-lg'
                unoptimized
              />
            ) : isPDF ? (
              <div className='w-full max-w-xs sm:max-w-md rounded-lg overflow-hidden'>
              <iframe
              src={content}
              className='w-full h-[450px] sm:h-[400px] rounded-lg border border-white/10'
              title='PDF Preview'
              style={{ zoom: 1 }}
              />
             <div className="mt-2 text-center">
             <a
                href={content}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 underline"
            >
          📥 Download PDF
          </a>
        </div>
      </div>
            ) : null
          ) : role === 'user' ? (
            <span className='text-white/90'>{content}</span>
          ) : (
            <>
              <Image
                src={assets.chatgpt_icon}
                alt=''
                className='h-9 w-9 p-1 border border-white/15 rounded-full'
              />
              <div className='space-y-4 w-full overflow-scroll'>
                <Markdown>{content}</Markdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message
