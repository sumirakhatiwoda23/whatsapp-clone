const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// Get messages between two users
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id
    const otherUserId = req.params.userId

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(from.eq.${currentUserId},to.eq.${otherUserId}),and(from.eq.${otherUserId},to.eq.${currentUserId})`)
      .order('timestamp', { ascending: true })

    if (error) throw error

    res.json({ messages: messages || [] })
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Save message to database
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { to, content } = req.body
    const from = req.user.id

    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        from,
        to,
        content,
        timestamp: new Date().toISOString(),
        status: 'sent'
      }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ message })
  } catch (error) {
    console.error('Save message error:', error)
    res.status(500).json({ error: 'Failed to save message' })
  }
})

module.exports = router