import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import { useSocket } from '../hooks/useSocket'
import { useChatStore } from '../store/chatStore'

export default function Chat() {
  const { socket, connected } = useSocket()
  const activeChat = useChatStore((state) => state.activeChat)

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      {activeChat ? (
        <ChatWindow />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">WhatsApp Clone</h2>
            <p className="text-gray-500">Select a chat to start messaging</p>
            {!connected && (
              <p className="text-red-500 mt-4">⚠️ Connecting to server...</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}