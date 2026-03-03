import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    if (mode === 'login') {
      const err = await signIn(email, password)
      if (err) {
        setError(err)
      } else {
        navigate('/')
      }
    } else {
      const err = await signUp(email, password)
      if (err) {
        setError(err)
      } else {
        setInfo('Check your email to confirm your account, then sign in.')
        setMode('login')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white text-xl font-bold mb-3">
            A
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Agility Assessment</h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading
                ? 'Please wait…'
                : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setInfo(null) }}
            className="text-indigo-600 hover:underline font-medium"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
