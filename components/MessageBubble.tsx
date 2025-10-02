'use client'
import React from 'react'
import { Message } from '@/stores/useChatStore'

export default function MessageBubble({ m, onCopy }: { m: Message, onCopy?: (text?:string)=>void }) {
  const isUser = m.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} py-1`}>
      <div className={`${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-black'} p-3 rounded-lg max-w-[70%] relative`}>
        {m.image && <img src={m.image} alt="uploaded" className="max-w-full rounded mb-2" />}
        <div>{m.text}</div>
        <div className="text-xs text-gray-400 mt-1 text-right">
          {new Date(m.createdAt).toLocaleTimeString()}
        </div>
        <button
          onClick={() => onCopy?.(m.text)}
          className="absolute top-1 right-1 text-xs opacity-0 hover:opacity-100"
        >
          Copy
        </button>
      </div>
    </div>
  )
}
