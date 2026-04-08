import ReactMarkdown from 'react-markdown'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-enter flex gap-3 mb-5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
        isUser
          ? 'bg-sunset-500 text-white'
          : 'bg-gradient-to-br from-earth-500 to-earth-700 text-white'
      }`}>
        {isUser ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" />
            <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V21H8a1 1 0 100 2h8a1 1 0 100-2h-3v-3.07A7 7 0 0019 11z" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-sunset-500 text-white rounded-tr-md'
          : 'bg-white text-earth-800 rounded-tl-md shadow-sm border border-sand-200'
      }`}>
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-code:text-sunset-700 prose-code:bg-sand-100 prose-code:px-1 prose-code:rounded prose-strong:text-earth-800">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {message.timestamp && (
          <p className={`text-[10px] mt-1.5 ${isUser ? 'text-sunset-200' : 'text-sand-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString('am-ET', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  )
}
