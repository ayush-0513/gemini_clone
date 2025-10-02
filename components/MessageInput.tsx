'use client'
import React, { useRef, useState } from 'react'

export default function MessageInput({ onSend }: { onSend: (payload: { text?: string, image?: string }) => void }) {
  const [text, setText] = useState('')
  const fileRef = useRef<HTMLInputElement | null>(null)

  function handleSend() {
    if (!text && !fileRef.current?.files?.length) return

    if (fileRef.current?.files?.[0]) {
      const reader = new FileReader()
      reader.onload = () => {
        onSend({ image: String(reader.result), text: text || '' })
        setText('')
        if (fileRef.current) fileRef.current.value = ''
      }
      reader.readAsDataURL(fileRef.current.files[0])
    } else {
      onSend({ text })
      setText('')
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        className="flex-1 p-2 border rounded"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
      />
      <input ref={fileRef} type="file" accept="image/*" />
      <button onClick={handleSend} className="bg-blue-600 text-white px-3 py-2 rounded">
        Send
      </button>
    </div>
  )
}
