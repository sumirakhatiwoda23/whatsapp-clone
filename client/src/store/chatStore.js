import { create } from 'zustand'

export const useChatStore = create((set) => ({
  conversations: [],
  activeChat: null,
  messages: [],
  onlineUsers: [],
  
  setConversations: (conversations) => set({ conversations }),
  setActiveChat: (chat) => set({ activeChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  updateMessageStatus: (messageId, status) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    )
  })),
}))