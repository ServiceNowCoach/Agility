import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()

  const navLinks = [
    { to: '/', label: 'Dashboard' },
  ]

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center text-xs font-bold">
            AM
          </div>
          <span className="font-semibold text-sm tracking-wide">Agility Maturity</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                pathname === to
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/assessment/new"
            className="ml-3 px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            + New Assessment
          </Link>
          {supabase && user && (
            <button
              onClick={signOut}
              className="ml-2 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title={user.email}
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
