import useVoice from '../hooks/useVoice'

export default function VoicePanel() {
  const {
    isActive,
    isListening,
    isSpeaking,
    inputTranscript,
    outputTranscript,
    error,
    start,
    stop,
  } = useVoice()

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Mic Button with rings */}
      <div className="relative">
        {/* Outer pulse rings */}
        {isActive && (
          <>
            <span className="absolute inset-[-16px] rounded-full border-2 border-red-400/30 pulse-ring" />
            <span className="absolute inset-[-32px] rounded-full border border-red-400/15 pulse-ring" style={{ animationDelay: '0.5s' }} />
          </>
        )}
        {!isActive && (
          <span className="absolute inset-[-12px] rounded-full border-2 border-sunset-300/40 animate-pulse" />
        )}

        <button
          onClick={isActive ? stop : start}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
            isActive
              ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/30'
              : 'bg-gradient-to-br from-sunset-400 to-sunset-600 shadow-xl shadow-sunset-500/30 hover:shadow-2xl hover:shadow-sunset-500/40'
          }`}
        >
          {isActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" />
              <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V21H8a1 1 0 100 2h8a1 1 0 100-2h-3v-3.07A7 7 0 0019 11z" />
            </svg>
          )}
        </button>
      </div>

      {/* Status */}
      <p className="mt-5 text-sm font-semibold text-earth-700">
        {!isActive && '\u121B\u12ED\u12AD\u122E\u134E\u1295 \u12ED\u12AD\u1348\u1271'}
        {isActive && isListening && !isSpeaking && '\u12A5\u12E8\u1230\u121B\u1201 \u1290\u12CD...'}
        {isActive && isSpeaking && '\u12A5\u12E8\u1270\u1293\u1308\u1228 \u1290\u12CD...'}
      </p>
      <p className="text-[11px] text-sand-400 mt-1">
        {isActive ? '\u1208\u121B\u1246\u121D \u12A0\u122D\u121B\u12CD\u1295 \u12ED\u12AD\u1260\u1231' : '\u1260\u12A0\u121B\u122D\u129B \u12ED\u1293\u1308\u1229'}
      </p>

      {/* Error */}
      {error && (
        <div className="mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-xl max-w-md">
          <p className="text-xs text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Live transcription */}
      {isActive && (inputTranscript || outputTranscript) && (
        <div className="mt-6 w-full max-w-md space-y-3 fade-in">
          {inputTranscript && (
            <div className="bg-white border border-sand-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-sunset-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-sand-500">{'\u12A5\u122D\u1235\u12CE'}</span>
              </div>
              <p className="text-sm text-earth-800 pl-7">{inputTranscript}</p>
            </div>
          )}
          {outputTranscript && (
            <div className="bg-white border border-earth-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-earth-500 to-earth-700 flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">{'\u1270'}</span>
                </div>
                <span className="text-[11px] font-semibold text-sand-500">{'\u1270\u1293\u130B\u122A'}</span>
              </div>
              <p className="text-sm text-earth-800 pl-7">{outputTranscript}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
