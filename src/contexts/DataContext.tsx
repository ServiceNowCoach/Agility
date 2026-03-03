import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Assessment, ProblemEntry, Response } from '@/types'
import { mockAssessments as seedAssessments, mockProblems as seedProblems } from '@/data/mockAssessments'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  fetchAssessments as fetchAssessmentsSvc,
  createAssessment as createAssessmentSvc,
} from '@/services/assessmentService'
import {
  fetchAllProblems,
  upsertProblem,
  deleteProblem as deleteProblemSvc,
} from '@/services/problemService'

const KEYS = {
  assessments: 'aa_assessments',
  problems: 'aa_problems',
}

function loadOrSeed<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T[]
  } catch {
    // ignore
  }
  return seed
}

function persistLocal(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data))
}

interface DataContextValue {
  assessments: Assessment[]
  problems: ProblemEntry[]
  loading: boolean
  addAssessment: (orgName: string, assessor: string, responses: Response[]) => Promise<string>
  addProblem: (entry: Omit<ProblemEntry, 'id'>) => Promise<void>
  updateProblem: (entry: ProblemEntry) => Promise<void>
  deleteProblem: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [problems, setProblems] = useState<ProblemEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Re-load whenever auth state changes
  useEffect(() => {
    if (supabase && user) {
      // Logged in with Supabase → fetch from DB
      setLoading(true)
      Promise.all([fetchAssessmentsSvc(), fetchAllProblems()])
        .then(([a, p]) => {
          setAssessments(a)
          setProblems(p)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else if (!supabase) {
      // No Supabase configured → use localStorage
      setAssessments(loadOrSeed(KEYS.assessments, seedAssessments))
      setProblems(loadOrSeed(KEYS.problems, seedProblems))
      setLoading(false)
    } else {
      // Supabase configured but user logged out → clear
      setAssessments([])
      setProblems([])
      setLoading(false)
    }
  }, [user])

  // ── Assessments ──────────────────────────────────────────────

  const addAssessment = useCallback(
    async (orgName: string, assessor: string, responses: Response[]): Promise<string> => {
      if (supabase) {
        const a = await createAssessmentSvc(orgName, assessor, responses)
        setAssessments((prev) => [a, ...prev])
        return a.id
      } else {
        const a: Assessment = {
          id: `a${Date.now()}`,
          orgName,
          assessor,
          createdAt: new Date().toISOString(),
          responses,
        }
        setAssessments((prev) => {
          const next = [a, ...prev]
          persistLocal(KEYS.assessments, next)
          return next
        })
        return a.id
      }
    },
    []
  )

  // ── Problems ─────────────────────────────────────────────────

  const addProblem = useCallback(async (entry: Omit<ProblemEntry, 'id'>): Promise<void> => {
    if (supabase) {
      const created = await upsertProblem(entry)
      setProblems((prev) => [...prev, created])
    } else {
      const newEntry: ProblemEntry = { ...entry, id: `pr${Date.now()}` }
      setProblems((prev) => {
        const next = [...prev, newEntry]
        persistLocal(KEYS.problems, next)
        return next
      })
    }
  }, [])

  const updateProblem = useCallback(async (entry: ProblemEntry): Promise<void> => {
    if (supabase) {
      const updated = await upsertProblem(entry)
      setProblems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    } else {
      setProblems((prev) => {
        const next = prev.map((p) => (p.id === entry.id ? entry : p))
        persistLocal(KEYS.problems, next)
        return next
      })
    }
  }, [])

  const deleteProblem = useCallback(async (id: string): Promise<void> => {
    if (supabase) {
      await deleteProblemSvc(id)
      setProblems((prev) => prev.filter((p) => p.id !== id))
    } else {
      setProblems((prev) => {
        const next = prev.filter((p) => p.id !== id)
        persistLocal(KEYS.problems, next)
        return next
      })
    }
  }, [])

  return (
    <DataContext.Provider
      value={{ assessments, problems, loading, addAssessment, addProblem, updateProblem, deleteProblem }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
