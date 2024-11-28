import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setMessages, setUsers } from '../../store/chatSlice'
import { getSocket } from '../../api/socket'
import MessageList from './MessageList'
import UserList from './UserList'

const ChatBox = () => {
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const socket = getSocket()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (socket) {
      dispatch(setMessages([]))
      dispatch(setUsers([]))

      socket.on('messageHistory', (messages) => {
        console.log('Historique reçu:', messages)
        dispatch(setMessages(messages))
      })

      socket.on('newMessage', (message) => {
        console.log('Nouveau message:', message)
        dispatch(addMessage(message))
      })

      socket.on('userList', (users) => {
        console.log('Liste des utilisateurs:', users)
        dispatch(setUsers(users))
      })

      socket.emit('getMessageHistory')

      return () => {
        socket.off('messageHistory')
        socket.off('newMessage')
        socket.off('userList')
      }
    }
  }, [socket, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && socket) {
      socket.emit('chatMessage', { content: message.trim() })
      setMessage('')
    }
  }

  return (
    <div className="flex h-[500px] border rounded-lg">
      <div className="flex-1 flex flex-col">
        <MessageList currentUser={user} />
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Écrivez votre message..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!message.trim()}
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
      <UserList />
    </div>
  )
}

export default ChatBox
