import { useRef, useEffect, useState } from 'react'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import TypingIndicator from './TypingIndicator'
import VoicePanel from './VoicePanel'
import useChat from '../hooks/useChat'

export default function ChatWindow({ user, onLogout }) {
  const { messages, isStreaming, language, setLanguage, sendMessage, conversations, loadConversation, newConversation } = useChat()
  const messagesEndRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mode, setMode] = useState('text')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex h-full relative bg-sand-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 h-full
        ${sidebarOpen ? 'w-72' : 'w-0'}
        transition-all duration-300 overflow-hidden
        bg-earth-800 flex flex-col
      `}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-earth-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sunset-400 to-sunset-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" />
                <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V21H8a1 1 0 100 2h8a1 1 0 100-2h-3v-3.07A7 7 0 0019 11z" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm flex-1">{'\u1270\u1293\u130B\u122A'}</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-earth-700 rounded md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => { newConversation(); setSidebarOpen(false) }}
            className="w-full py-2.5 px-3 border border-earth-600 text-earth-200 rounded-xl text-sm font-medium hover:bg-earth-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {'\u12A0\u12F2\u1235 \u12CD\u12ED\u12ED\u1275'}
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.map((conv) => (
            <button
              key={conv.conversation_id}
              onClick={() => { loadConversation(conv.conversation_id); setSidebarOpen(false) }}
              className="w-full text-left px-4 py-3 hover:bg-earth-700/50 transition-colors group"
            >
              <p className="text-sm text-earth-200 truncate group-hover:text-white">
                {conv.preview || '\u12A0\u12F2\u1235 \u12CD\u12ED\u12ED\u1275'}
              </p>
              <p className="text-xs text-earth-500 mt-0.5">
                {new Date(conv.updated_at).toLocaleDateString('am-ET')}
              </p>
            </button>
          ))}
        </div>

        {/* User section */}
        <div className="p-3 border-t border-earth-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sunset-500 flex items-center justify-center text-white font-bold text-xs">
              {user?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-earth-300 flex-1 truncate">{user}</span>
            <button onClick={onLogout} className="p-1.5 hover:bg-earth-700 rounded-lg text-earth-400 hover:text-red-400 transition-colors" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-sand-50">
        {/* Header */}
        <header className="glass-header border-b border-sand-200/50 px-3 sm:px-5 py-2.5 flex items-center gap-2 sm:gap-3 safe-top z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sand-100 rounded-lg transition-colors text-earth-600 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-earth-800 truncate">
              {'\u1270\u1293\u130B\u122A'} <span className="text-sunset-500">AI</span>
            </h1>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center bg-sand-100 rounded-xl p-0.5 text-xs font-semibold shrink-0">
            <button
              onClick={() => setMode('text')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                mode === 'text'
                  ? 'bg-white text-earth-800 shadow-sm'
                  : 'text-sand-500 hover:text-earth-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setMode('voice')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                mode === 'voice'
                  ? 'bg-white text-earth-800 shadow-sm'
                  : 'text-sand-500 hover:text-earth-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
              </svg>
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center bg-sand-100 rounded-xl p-0.5 text-xs font-semibold shrink-0">
            <button
              onClick={() => setLanguage('am')}
              className={`px-2 py-1.5 rounded-lg transition-all ${language === 'am' ? 'bg-white text-earth-800 shadow-sm' : 'text-sand-500'}`}
            >AM</button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1.5 rounded-lg transition-all ${language === 'en' ? 'bg-white text-earth-800 shadow-sm' : 'text-sand-500'}`}
            >EN</button>
          </div>
        </header>

        {mode === 'text' ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto messages-container px-3 sm:px-6 py-4 sm:py-6 gradient-bg">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-400 to-sunset-600 flex items-center justify-center shadow-lg shadow-sunset-500/20 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" />
                      <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V21H8a1 1 0 100 2h8a1 1 0 100-2h-3v-3.07A7 7 0 0019 11z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-earth-700 mb-2">
                    {'\u12A5\u1295\u1263\u12A5 \u1270\u1240\u1260\u1209! \u12A5\u1294 \u1270\u1293\u130B\u122A \u1290\u129D'}
                  </h2>
                  <p className="text-sand-500 max-w-sm text-sm mb-6">
                    {'\u1260\u12A0\u121B\u122D\u129B \u1260\u1320\u1295\u12AB\u122B \u12E8\u121A\u1293\u1308\u122D \u12E8AI \u1228\u12F3\u1275\u12CE\u1295\u1362 \u121B\u1295\u129B\u12CD\u1295\u121D \u12ED\u1325\u12E8\u1241\u129D!'}
                  </p>
                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {['\u1230\u120B\u121D! \u12A5\u1295\u12F0\u121D\u1295 \u1290\u1285?', '\u1235\u1208 \u12A2\u1275\u12EE\u1335\u12EB \u1295\u1308\u1228\u129D', '\u12A0\u121B\u122D\u129B \u12A0\u1235\u1270\u121B\u1228\u129D'].map((text) => (
                      <button
                        key={text}
                        onClick={() => sendMessage(text)}
                        className="px-4 py-2.5 bg-white border border-sand-200 rounded-2xl text-xs text-earth-700 hover:border-sunset-300 hover:bg-sunset-50 hover:shadow-md transition-all shadow-sm active:scale-95"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="max-w-3xl mx-auto">
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}
                {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
                  <TypingIndicator />
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <InputBar onSend={sendMessage} disabled={isStreaming} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sunset-400 to-sunset-600 flex items-center justify-center shadow-lg shadow-sunset-500/20 mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" />
                  <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V21H8a1 1 0 100 2h8a1 1 0 100-2h-3v-3.07A7 7 0 0019 11z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-earth-700 mb-1">
                {'\u12E8\u12F5\u121D\u133D \u12CD\u12ED\u12ED\u1275'}
              </h2>
              <p className="text-sand-500 text-sm">
                {'\u121B\u12ED\u12AD\u122E\u134E\u1295\u1295 \u12ED\u12AD\u1348\u1271 \u12A5\u1293 \u1260\u12A0\u121B\u122D\u129B \u12ED\u1293\u1308\u1229'}
              </p>
            </div>
            <VoicePanel />
          </div>
        )}
      </div>
    </div>
  )
}
