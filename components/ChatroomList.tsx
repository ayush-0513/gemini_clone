'use client'
import React, { useState } from 'react'
import { useChatStore } from '@/stores/useChatStore'
import ChatroomCard from './ChatroomCard'
import useDebounce from '@/hooks/useDebounce'

export default function ChatroomList({ onOpen }: { onOpen: (id:string)=>void }) {
  const rooms = useChatStore(s => s.chatrooms)
  const createChatroom = useChatStore(s => s.createChatroom)
  const deleteChatroom = useChatStore(s => s.deleteChatroom)
  const [q, setQ] = useState('')
  const deb = useDebounce(q, 300)
  const filtered = rooms.filter(r => r.title.toLowerCase().includes(deb.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Search chats..."
        />
        <button
          onClick={() => {
            const id = createChatroom()
            onOpen(id)
          }}
          className="bg-blue-600 text-white px-3 rounded"
        >
          New
        </button>
      </div>
      <div className="space-y-2">
        {filtered.map(r => (
          <ChatroomCard
            key={r.id}
            room={r}
            onDelete={deleteChatroom}
            onOpen={onOpen}
          />
        ))}
        {filtered.length === 0 && <div className="text-gray-500">No chats</div>}
      </div>
    </div>
  )
}
