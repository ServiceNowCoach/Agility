/**
 * problemService.ts
 *
 * Data-access layer for the problem register.
 */
import { supabase } from '@/lib/supabase'
import type { ProblemEntry } from '@/types'

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

// Fetches all problems for the authenticated user (RLS handles filtering by user)
export async function fetchAllProblems(): Promise<ProblemEntry[]> {
  const db = requireSupabase()
  const { data, error } = await db.from('problem_register').select('*')
  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function fetchProblems(assessmentId: string): Promise<ProblemEntry[]> {
  const db = requireSupabase()
  const { data, error } = await db
    .from('problem_register')
    .select('*')
    .eq('assessment_id', assessmentId)
  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function upsertProblem(
  entry: Omit<ProblemEntry, 'id'> & { id?: string }
): Promise<ProblemEntry> {
  const db = requireSupabase()
  const row = {
    ...(entry.id ? { id: entry.id } : {}),
    assessment_id: entry.assessmentId,
    category: entry.category,
    gap_description: entry.gapDescription,
    owner: entry.owner || null,
    target_date: entry.targetDate || null,
    status: entry.status,
  }
  const { data, error } = await db
    .from('problem_register')
    .upsert(row)
    .select()
    .single()
  if (error) throw error
  return mapRow(data)
}

export async function deleteProblem(id: string): Promise<void> {
  const db = requireSupabase()
  const { error } = await db.from('problem_register').delete().eq('id', id)
  if (error) throw error
}

function mapRow(row: Record<string, unknown>): ProblemEntry {
  return {
    id: row.id as string,
    assessmentId: row.assessment_id as string,
    category: row.category as ProblemEntry['category'],
    gapDescription: row.gap_description as string,
    owner: (row.owner as string) ?? '',
    targetDate: (row.target_date as string) ?? '',
    status: row.status as ProblemEntry['status'],
  }
}
