'use client'
import React from 'react'
import ChatroomList from '@/components/ChatroomList'
import { useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

export default function Dashboard(){
  const router = useRouter()
  function openChat(id:string){
    router.push(`/chat/${id}`)
  }
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h1 className="text-2xl font-bold mb-4">Chats</h1>
          <ChatroomList onOpen={openChat} />
        </div>
        <div className="md:col-span-2 p-4 border rounded">
          <h2 className="text-lg">Welcome to Gemini Clone</h2>
          <p className="text-sm text-gray-600">Open a chat or create a new one.</p>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
