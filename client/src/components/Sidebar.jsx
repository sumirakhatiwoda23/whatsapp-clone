import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { FaSearch, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { conversations, activeChat, setActiveChat, onlineUsers } = useChatStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = useAuthStore.getState().token
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isOnline = (userId) => onlineUsers.includes(userId)

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-whatsapp-teal p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaUserCircle className="text-3xl text-white" />
          <div>
            <h3 className="text-white font-semibold">{user?.name}</h3>
            <p className="text-xs text-gray-200">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-white hover:bg-whatsapp-dark p-2 rounded-full transition"
          title="Logout"
        >
          <FaSignOutAlt />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 bg-gray-50 border-b">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => setActiveChat(u)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                activeChat?.id === u.id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <FaUserCircle className="text-4xl text-gray-400" />
                  {isOnline(u.id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold text-gray-800 truncate">{u.name}</h4>
                    {isOnline(u.id) && (
                      <span className="text-xs text-green-600">Online</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{u.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}