import { useState, useRef } from 'react'

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div className="border-t border-sand-200 bg-white px-3 sm:px-6 py-3 safe-bottom">
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={'\u1218\u120D\u12A5\u12AD\u1276\u1295 \u12A5\u12DA \u12ED\u133B\u1349...'}
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-2xl border border-sand-200 pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sunset-400/50 focus:border-sunset-300 disabled:opacity-50 bg-sand-50 placeholder-sand-400 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            className="absolute right-2 bottom-1.5 p-2 bg-sunset-500 text-white rounded-xl hover:bg-sunset-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
