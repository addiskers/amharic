import { useState, useCallback, useEffect } from 'react'
import { sendChatMessage, fetchConversations, fetchConversation } from '../services/api'

export default function useChat() {
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [language, setLanguage] = useState('am')
  const [conversations, setConversations] = useState([])

  // Load conversations list on mount
  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch(() => {})
  }, [])

  const refreshConversations = useCallback(() => {
    fetchConversations()
      .then(setConversations)
      .catch(() => {})
  }, [])

  const sendMessage = useCallback(async (text) => {
    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMessage])
    setIsStreaming(true)

    try {
      const response = await sendChatMessage(text, conversationId, language)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      let newConversationId = conversationId
      let buffer = ''

      // Add empty assistant message that we'll update
      setMessages((prev) => [...prev, { role: 'assistant', content: '', timestamp: new Date().toISOString() }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))

            if (data.error) {
              assistantContent = `\u12ED\u1245\u122D\u1273\u1363 \u127D\u130D\u122D \u12A0\u1208: ${data.error}`
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = { ...updated[updated.length - 1], content: assistantContent }
                return updated
              })
              break
            }

            if (data.conversation_id) {
              newConversationId = data.conversation_id
            }

            if (data.chunk) {
              assistantContent += data.chunk
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = { ...updated[updated.length - 1], content: assistantContent }
                return updated
              })
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      if (newConversationId) {
        setConversationId(newConversationId)
      }
      refreshConversations()
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '\u12ED\u1245\u122D\u1273\u1363 \u12A0\u1201\u1295 \u121D\u120B\u123D \u1218\u1218\u1208\u1235 \u12A0\u120D\u127B\u120D\u12A9\u121D\u1362 \u12A5\u1263\u12AD\u12CE \u12F5\u130C\u121D \u12ED\u121E\u12AD\u1229\u1362', timestamp: new Date().toISOString() },
      ])
    } finally {
      setIsStreaming(false)
    }
  }, [conversationId, language, refreshConversations])

  const loadConversation = useCallback(async (id) => {
    try {
      const data = await fetchConversation(id)
      setConversationId(id)
      setMessages(data.messages || [])
    } catch {
      // Failed to load
    }
  }, [])

  const newConversation = useCallback(() => {
    setConversationId(null)
    setMessages([])
  }, [])

  return {
    messages,
    isStreaming,
    language,
    setLanguage,
    sendMessage,
    conversations,
    loadConversation,
    newConversation,
  }
}
