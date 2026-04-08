export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div className="flex items-center bg-sand-100 rounded-lg p-0.5 sm:p-1 text-xs sm:text-sm font-semibold shrink-0">
      <button
        onClick={() => setLanguage('am')}
        className={`px-2 sm:px-3 py-1 rounded-md transition-colors ${
          language === 'am'
            ? 'bg-sunset-500 text-white'
            : 'text-sand-600 hover:text-earth-800'
        }`}
      >
        AM
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 sm:px-3 py-1 rounded-md transition-colors ${
          language === 'en'
            ? 'bg-sunset-500 text-white'
            : 'text-sand-600 hover:text-earth-800'
        }`}
      >
        EN
      </button>
    </div>
  )
}
