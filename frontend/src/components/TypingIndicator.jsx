export default function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-5 message-enter">
      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-earth-500 to-earth-700 flex items-center justify-center">
        <span className="text-[10px] text-white font-bold">{'\u1270'}</span>
      </div>
      <div className="bg-white border border-sand-200 rounded-2xl rounded-tl-md px-5 py-3 flex items-center gap-1.5 shadow-sm">
        <span className="typing-dot w-2 h-2 bg-sunset-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-sunset-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-sunset-400 rounded-full inline-block" />
      </div>
    </div>
  )
}
