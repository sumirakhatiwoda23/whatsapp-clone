import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'

let socket = null

export const useSocket = () => {
  const [connected, setConnected] = useState(false)
  const { user, token } = useAuthStore()
  const { addMessage, setOnlineUsers } = useChatStore()

  useEffect(() => {
    if (!user || !token) return

    socket = io('http://localhost:5000', {
      auth: { token }
    })

    socket.on('connect', () => {
      console.log('Connected to socket server')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
      setConnected(false)
    })

    socket.on('receive_message', (message) => {
      addMessage(message)
    })

    socket.on('online_users', (users) => {
      setOnlineUsers(users)
    })

    socket.on('user_online', (userId) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])])
    })

    socket.on('user_offline', (userId) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId))
    })

    return () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [user, token])

  return { socket, connected }
}