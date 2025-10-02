'use client'

import React, { useEffect, useRef, useState, use } from 'react'
import { useChatStore } from '@/stores/useChatStore'
import MessageBubble from '@/components/MessageBubble'
import MessageInput from '@/components/MessageInput'
import toast from 'react-hot-toast'

// ✅ Fix for Next.js 15: params is async → use()
export default function ChatPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params) // unwrap params safely

  const room = useChatStore((s) => s.chatrooms.find((r) => r.id === id))
  const addMessage = useChatStore((s) => s.addMessage)
  const loadOlder = useChatStore((s) => s.loadOlderMessages)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isTyping, setTyping] = useState(false)
  const [page, setPage] = useState(0)
  const [today, setToday] = useState<string>('')

  // ✅ Fix hydration error: generate date client-side only
  useEffect(() => {
    setToday(new Date().toLocaleDateString())
  }, [])

  // Auto scroll to bottom when new messages
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [room?.messages?.length])

  function onSend(payload: { text?: string; image?: string }) {
    addMessage(id, { role: 'user', ...payload })
    toast.success('Message sent')

    if (isTyping) return
    setTyping(true)

    setTimeout(() => {
      addMessage(id, { role: 'ai', text: `Echo: ${payload.text ?? '[image]'}` })
      setTyping(false)
    }, 1200)
  }

  function loadMore() {
    setPage((p) => p + 1)
    loadOlder(id, page + 1, 10)
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Chat not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto flex flex-col h-[85vh] bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-semibold text-lg">{room.title}</h2>
          <span className="text-sm text-gray-500">{today}</span>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-auto p-4 space-y-2 bg-gray-50 dark:bg-slate-900"
          ref={containerRef}
        >
          <button
            onClick={loadMore}
            className="mx-auto mb-2 text-sm text-blue-600 hover:underline block"
          >
            Load older
          </button>

          {room.messages.map((m) => (
            <MessageBubble
              key={m.id}
              m={m}
              onCopy={(text: string | undefined) => {
                navigator.clipboard.writeText(text || '')
                toast.success('Copied')
              }}
            />
          ))}

          {isTyping && (
            <div className="text-sm text-gray-500 italic">Gemini is typing...</div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t dark:border-slate-700 bg-white dark:bg-slate-800">
          <MessageInput onSend={onSend} />
        </div>
      </div>
    </div>
  )
}
