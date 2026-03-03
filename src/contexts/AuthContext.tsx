import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      if (!supabase) return 'Supabase is not configured.'
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return error?.message ?? null
    },
    []
  )

  const signUp = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      if (!supabase) return 'Supabase is not configured.'
      const { error } = await supabase.auth.signUp({ email, password })
      return error?.message ?? null
    },
    []
  )

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setSession(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, session, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
