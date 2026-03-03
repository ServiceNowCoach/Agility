export type Category = 'Team' | 'ART' | 'Program' | 'Portfolio' | 'Organizational'

export type MaturityLevel =
  | 'Initial'
  | 'Developing'
  | 'Defined'
  | 'Managed'
  | 'Optimizing'

export interface Question {
  id: string
  category: Category
  text: string
  weight: number // 1–3
  maxScore: number // always 5
}

export interface Response {
  questionId: string
  score: number // 1–5
}

export interface Assessment {
  id: string
  orgName: string
  assessor: string
  createdAt: string // ISO date string
  responses: Response[]
}

export interface CategoryScore {
  category: Category
  percent: number
  label: MaturityLevel
  weightedScore: number
  maxPossible: number
}

export interface AssessmentResult {
  assessment: Assessment
  categoryScores: CategoryScore[]
  overallPercent: number
  overallLabel: MaturityLevel
}

export type ProblemStatus = 'Open' | 'In Progress' | 'Resolved'

export interface ProblemEntry {
  id: string
  assessmentId: string
  category: Category
  gapDescription: string
  owner: string
  targetDate: string
  status: ProblemStatus
}
