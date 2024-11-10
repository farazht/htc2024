'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HiSparkles } from "react-icons/hi2";

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const toggleChat = () => setIsOpen(!isOpen)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Message sent:', message)
    setMessage('')
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-md flex flex-col h-[80vh] max-h-[600px]">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">BillBoardBot</h2>
              <Button variant="ghost" size="icon" onClick={toggleChat} aria-label="Close chat" className="hover:bg-primary">
                <X className="h-4 w-4" fill={"blue"}/>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100% - 130px)' }}>
              {/* CHAT MESSAGES HERE */}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask a question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-16 h-16 flex items-center justify-center z-50"
        aria-label="Open chat"
      >
        <HiSparkles size={24}/>
      </Button>
    </>
  )
}