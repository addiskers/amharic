import { useState } from 'react'
import ChatWindow from './components/ChatWindow'
import LoginPage from './components/LoginPage'

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('tenagari_user'))

  if (!user) {
    return <LoginPage onLogin={setUser} />
  }

  return (
    <div className="h-screen bg-sand-50">
      <ChatWindow user={user} onLogout={() => { localStorage.removeItem('tenagari_user'); setUser(null) }} />
    </div>
  )
}
