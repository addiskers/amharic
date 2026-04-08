const API_BASE = '/api'

export async function sendChatMessage(message, conversationId, language) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      language,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response
}

export async function fetchConversations() {
  const response = await fetch(`${API_BASE}/conversations`)
  if (!response.ok) throw new Error('Failed to fetch conversations')
  const data = await response.json()
  return data.conversations
}

export async function fetchConversation(conversationId) {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}`)
  if (!response.ok) throw new Error('Failed to fetch conversation')
  return response.json()
}

export async function deleteConversation(conversationId) {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete conversation')
  return response.json()
}
