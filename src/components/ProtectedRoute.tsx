import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  // If Supabase isn't configured, skip auth entirely
  if (!supabase) return <>{children}</>

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading…
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
