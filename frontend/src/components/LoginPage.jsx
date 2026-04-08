import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        setError('Invalid username or password')
        return
      }

      const data = await res.json()
      localStorage.setItem('tenagari_user', data.user)
      onLogin(data.user)
    } catch {
      setError('Connection failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-800 via-earth-700 to-earth-900 flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sunset-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sunset-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-sunset-400 to-sunset-600 shadow-xl shadow-sunset-500/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" />
              <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V21H8a1 1 0 100 2h8a1 1 0 100-2h-3v-3.07A7 7 0 0019 11z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{'\u1270\u1293\u130B\u122A'}</h1>
          <p className="text-earth-300 text-sm">{'\u12E8\u12A0\u121B\u122D\u129B AI \u1228\u12F3\u1275'}</p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-xl font-bold text-earth-800 mb-6 text-center">{'\u12ED\u130D\u1261'}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1.5">
                {'\u12E8\u1270\u1320\u1243\u121A \u1235\u121D'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-sunset-400 focus:border-transparent text-sm"
                placeholder="Username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1.5">
                {'\u12E8\u121A\u1235\u1325\u122D \u1241\u120D\u134D'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-sunset-400 focus:border-transparent text-sm"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-gradient-to-r from-sunset-500 to-sunset-600 text-white rounded-xl font-bold text-sm hover:from-sunset-600 hover:to-sunset-700 disabled:opacity-50 transition-all shadow-lg shadow-sunset-500/25"
          >
            {loading ? '\u12A5\u12E8\u1308\u1263 \u1290\u12CD...' : '\u130D\u1263'}
          </button>
        </form>

        <p className="text-center text-earth-400 text-xs mt-6">
          Powered by Gemini AI
        </p>
      </div>
    </div>
  )
}
