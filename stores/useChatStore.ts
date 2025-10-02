import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type Message = {
  id: string
  role: 'user' | 'ai'
  text?: string
  image?: string
  createdAt: number
}

export type Chatroom = {
  id: string
  title: string
  messages: Message[]
}

type ChatState = {
  chatrooms: Chatroom[]
  createChatroom: (title?: string) => string
  deleteChatroom: (id: string) => void
  addMessage: (chatId: string, msg: Omit<Message, 'id' | 'createdAt'>) => void
  loadOlderMessages: (chatId: string, page: number, pageSize: number) => void
}

const STORAGE_KEY = 'gemini_chatrooms_v1'

function loadFromStorage(): Chatroom[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveToStorage(state: Chatroom[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatrooms: loadFromStorage(),
  createChatroom: (title = 'New Chat') => {
    const id = nanoid()
    const room: Chatroom = { id, title, messages: [] }
    set((state) => {
      const next = [room, ...state.chatrooms]
      saveToStorage(next)
      return { chatrooms: next }
    })
    return id
  },
  deleteChatroom: (id) => {
    set((state) => {
      const next = state.chatrooms.filter((r) => r.id !== id)
      saveToStorage(next)
      return { chatrooms: next }
    })
  },
  addMessage: (chatId, msg) => {
    const m: Message = { id: nanoid(), createdAt: Date.now(), ...msg }
    set((state) => {
      const next = state.chatrooms.map((r) =>
        r.id === chatId ? { ...r, messages: [...r.messages, m] } : r
      )
      saveToStorage(next)
      return { chatrooms: next }
    })
  },
  loadOlderMessages: (chatId, page, pageSize) => {
    set((state) => {
      const next = state.chatrooms.map((r) => {
        if (r.id !== chatId) return r
        const older: Message[] = Array.from({ length: pageSize }).map(
          (_, i) => ({
            id: nanoid(),
            role: i % 2 === 0 ? 'ai' : 'user',
            text: `Older message ${page}-${i + 1}`,
            createdAt: Date.now() - (page * 100000 + i * 1000),
          })
        )
        return { ...r, messages: [...older, ...r.messages] }
      })
      saveToStorage(next)
      return { chatrooms: next }
    })
  },
}))
