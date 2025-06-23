import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import Image from 'next/image'
import React from 'react'
import toast from 'react-hot-toast'

interface ChatLabelProps {
  openMenu: {
    id: number | string
    open: boolean
  }
  setOpenMenu: React.Dispatch<React.SetStateAction<{ id: number | string; open: boolean }>>
  id: string
  name: string
}

const ChatLabel: React.FC<ChatLabelProps> = ({ openMenu, setOpenMenu, id, name }) => {
  const { fetchUsersChats, chats, setSelectedChat } = useAppContext()

  const selectChat = () => {
    const chatData = chats.find(chat => chat._id === id)
    setSelectedChat(chatData || null)
  }

  const renameHandler = async () => {
    try {
      const newName = prompt('Enter new name')
      if (!newName) return
      const { data } = await axios.post('/api/chat/rename', { chatId: id, name: newName })
      if (data.success) {
        fetchUsersChats()
        setOpenMenu({ id: 0, open: false })
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const deleteHandler = async () => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this chat?')
      if (!confirm) return
      const { data } = await axios.post('/api/chat/delete', { chatId: id })
      if (data.success) {
        fetchUsersChats()
        setOpenMenu({ id: 0, open: false })
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="relative scrollbar-none">
      <div
        onClick={selectChat}
        className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer"
      >
        <p className="truncate">{name}</p>

        <div
          onClick={e => {
            e.stopPropagation()
            setOpenMenu({ id, open: !openMenu.open || openMenu.id !== id })
          }}
          className="group relative flex items-center justify-center h-6 w-6 hover:bg-black/80 rounded-lg"
        >
          <Image
            src={assets.three_dots}
            alt=""
            className={`w-4 block lg:${openMenu.id === id && openMenu.open ? '' : 'hidden'} lg:group-hover:block`}
          />
        </div>
      </div>

      {/* Dropdown menu */}
      {openMenu.id === id && openMenu.open && (
        <div className="absolute top-full right-0 z-[9999] mt-1 bg-gray-700 rounded-xl w-40 p-2 shadow-lg">
          <div
            onClick={renameHandler}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer"
          >
            <Image src={assets.pencil_icon} alt="" className="w-4" />
            <p>Rename</p>
          </div>
          <div
            onClick={deleteHandler}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer"
          >
            <Image src={assets.delete_icon} alt="" className="w-4" />
            <p>Delete</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatLabel