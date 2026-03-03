/**
 * assessmentService.ts
 *
 * Data-access layer for assessments and responses.
 * Uses Supabase when credentials are configured; otherwise the
 * DataContext already handles localStorage — these functions are
 * provided so that switching to Supabase later is a drop-in change.
 */
import { supabase } from '@/lib/supabase'
import type { Assessment, Response } from '@/types'

// ── helpers ──────────────────────────────────────────────────

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  return supabase
}

// ── assessments ──────────────────────────────────────────────

export async function fetchAssessments(): Promise<Assessment[]> {
  const db = requireSupabase()
  // Use direct table join so RLS on `assessments` is respected (views bypass RLS by default)
  const { data, error } = await db
    .from('assessments')
    .select('*, responses(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapRowDirect)
}

export async function fetchAssessment(id: string): Promise<Assessment | null> {
  const db = requireSupabase()
  const { data, error } = await db
    .from('assessments')
    .select('*, responses(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return mapRowDirect(data)
}

export async function createAssessment(
  orgName: string,
  assessor: string,
  responses: Response[]
): Promise<Assessment> {
  const db = requireSupabase()

  // 1. Resolve authenticated user
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 2. Insert assessment row (user_id is required by the NOT NULL constraint)
  const { data: aRow, error: aErr } = await db
    .from('assessments')
    .insert({ org_name: orgName, assessor, user_id: user.id })
    .select()
    .single()
  if (aErr) throw aErr

  // 2. Insert all response rows
  const responseRows = responses.map((r) => ({
    assessment_id: aRow.id,
    question_id: r.questionId,
    score: r.score,
  }))
  const { error: rErr } = await db.from('responses').insert(responseRows)
  if (rErr) throw rErr

  return {
    id: aRow.id,
    orgName: aRow.org_name,
    assessor: aRow.assessor,
    createdAt: aRow.created_at,
    responses,
  }
}

export async function deleteAssessment(id: string): Promise<void> {
  const db = requireSupabase()
  const { error } = await db.from('assessments').delete().eq('id', id)
  if (error) throw error
}

// ── mappers ──────────────────────────────────────────────────

// Used when responses come from the nested join (column names are snake_case from DB)
function mapRowDirect(row: Record<string, unknown>): Assessment {
  const responses = (
    Array.isArray(row.responses) ? row.responses : []
  ) as Array<{ question_id: string; score: number }>
  return {
    id: row.id as string,
    orgName: row.org_name as string,
    assessor: row.assessor as string,
    createdAt: row.created_at as string,
    responses: responses.map((r) => ({ questionId: r.question_id, score: r.score })),
  }
}
