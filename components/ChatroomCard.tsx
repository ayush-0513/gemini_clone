// components/ChatroomCard.tsx
'use client'
import React from 'react'
import { Chatroom } from '@/stores/useChatStore'
import toast from 'react-hot-toast'


export default function ChatroomCard({ room, onDelete, onOpen }: { room: Chatroom, onDelete: (id:string)=>void, onOpen: (id:string)=>void }){
return (
<div className="p-3 border rounded flex justify-between items-center">
<div onClick={()=>onOpen(room.id)} className="cursor-pointer">
<div className="font-medium">{room.title}</div>
<div className="text-sm text-gray-500">{room.messages.length} messages</div>
</div>
<div>
<button className="text-sm text-red-500" onClick={()=>{ if(confirm('Delete chat?')){ onDelete(room.id); toast('Chat deleted') } }}>Delete</button>
</div>
</div>
)
}