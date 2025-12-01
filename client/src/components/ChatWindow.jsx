import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { useSocket } from '../hooks/useSocket'
import { FaUserCircle, FaPaperPlane, FaSmile } from 'react-icons/fa'
import { format } from 'date-fns'
import EmojiPicker from 'emoji-picker-react'

export default function ChatWindow() {
  const { user } = useAuthStore()
  const { activeChat, messages, setMessages, addMessage, onlineUsers } = useChatStore()
  const { socket } = useSocket()
  const [newMessage, setNewMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (activeChat) {
      loadMessages()
    }
  }, [activeChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      const token = useAuthStore.getState().token
      const response = await fetch(`/api/messages/${activeChat.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    const messageData = {
      to: activeChat.id,
      content: newMessage,
      timestamp: new Date().toISOString()
    }

    socket.emit('send_message', messageData)
    
    addMessage({
      ...messageData,
      from: user.id,
      status: 'sent'
    })

    setNewMessage('')
    setShowEmojiPicker(false)
  }

  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji)
  }

  const isOnline = onlineUsers.includes(activeChat?.id)

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-whatsapp-teal p-4 flex items-center space-x-3 shadow">
        <FaUserCircle className="text-3xl text-white" />
        <div className="flex-1">
          <h3 className="text-white font-semibold">{activeChat?.name}</h3>
          <p className="text-xs text-gray-200">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23f0f0f0\'/%3E%3C/svg%3E")' }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => {
              const isOwn = msg.from === user.id
              return (
                <div
                  key={idx}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg shadow ${
                      isOwn
                        ? 'bg-whatsapp-light text-gray-800'
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {format(new Date(msg.timestamp), 'HH:mm')}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-gray-100 p-4 border-t">
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <FaSmile className="text-2xl" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-whatsapp-green text-white p-3 rounded-full hover:bg-whatsapp-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  )
}