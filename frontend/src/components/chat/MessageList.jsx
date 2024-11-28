import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

const MessageList = ({ currentUser }) => {
  const messages = useSelector((state) => state.chat.messages)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <div key={message._id || index} className="mb-2">
          {message.type === 'system' ? (
            <div className="text-gray-500 italic text-center">
              {message.content}
            </div>
          ) : (
            <div
              className={`${
                message.sender?._id === currentUser?.id ? 'text-right' : ''
              }`}
            >
              <span className="font-bold">{message.sender?.username}: </span>
              <span>{message.content}</span>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
