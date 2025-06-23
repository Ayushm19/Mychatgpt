"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

interface Message {
  role: string;
  content: string;
  timestamp: number;
}

interface Chat {
  _id: string;
  name: string;
  updatedAt: string;
  messages: Message[];
}

interface AppContextType {
  user: any;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChat: Chat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  fetchUsersChats: () => Promise<void>;
  createNewChat: () => Promise<void>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const [prompt, setPrompt] = useState<string>("")

  const createNewChat = async () => {
    try {
      if (!user) return;

      const token = await getToken();
      await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsersChats();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchUsersChats = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setChats(data.data);

        if (data.data.length === 0) {
          await createNewChat();
          return fetchUsersChats();
        } else {
          data.data.sort(
            (a: Chat, b: Chat) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setSelectedChat(data.data[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsersChats();
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUsersChats,
        createNewChat,
        prompt,
        setPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
