import React from 'react'
import { useSelector } from 'react-redux'

const UserList = () => {
  const users = useSelector((state) => state.chat.users)

  return (
    <div className="w-48 bg-gray-100 p-4 border-l">
      <h3 className="font-bold mb-2">En ligne ({users.length})</h3>
      <ul className="space-y-1">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserList
