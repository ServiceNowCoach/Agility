import type { Assessment, ProblemEntry } from '@/types'

export const mockAssessments: Assessment[] = [
  {
    id: 'a1',
    orgName: 'Acme Corp',
    assessor: 'Jane Smith',
    createdAt: '2026-01-15T10:00:00Z',
    responses: [
      // Team
      { questionId: 't1',  score: 4 }, { questionId: 't2',  score: 4 },
      { questionId: 't3',  score: 3 }, { questionId: 't4',  score: 3 },
      { questionId: 't5',  score: 5 }, { questionId: 't6',  score: 4 },
      { questionId: 't7',  score: 3 }, { questionId: 't8',  score: 4 },
      { questionId: 't9',  score: 3 }, { questionId: 't10', score: 4 },
      { questionId: 't11', score: 4 }, { questionId: 't12', score: 3 },
      // ART
      { questionId: 'a1',  score: 3 }, { questionId: 'a2',  score: 3 },
      { questionId: 'a3',  score: 2 }, { questionId: 'a4',  score: 3 },
      { questionId: 'a5',  score: 2 }, { questionId: 'a6',  score: 3 },
      { questionId: 'a7',  score: 2 }, { questionId: 'a8',  score: 3 },
      { questionId: 'a9',  score: 2 }, { questionId: 'a10', score: 3 },
      { questionId: 'a11', score: 3 }, { questionId: 'a12', score: 2 },
      // Program
      { questionId: 'p1',  score: 4 }, { questionId: 'p2',  score: 3 },
      { questionId: 'p3',  score: 4 }, { questionId: 'p4',  score: 3 },
      { questionId: 'p5',  score: 3 }, { questionId: 'p6',  score: 2 },
      { questionId: 'p7',  score: 3 }, { questionId: 'p8',  score: 2 },
      { questionId: 'p9',  score: 3 }, { questionId: 'p10', score: 2 },
      { questionId: 'p11', score: 3 }, { questionId: 'p12', score: 3 },
      // Portfolio
      { questionId: 'pf1',  score: 2 }, { questionId: 'pf2',  score: 2 },
      { questionId: 'pf3',  score: 1 }, { questionId: 'pf4',  score: 2 },
      { questionId: 'pf5',  score: 2 }, { questionId: 'pf6',  score: 1 },
      { questionId: 'pf7',  score: 2 }, { questionId: 'pf8',  score: 2 },
      { questionId: 'pf9',  score: 2 }, { questionId: 'pf10', score: 2 },
      { questionId: 'pf11', score: 1 }, { questionId: 'pf12', score: 2 },
      // Organizational
      { questionId: 'o1',  score: 3 }, { questionId: 'o2',  score: 3 },
      { questionId: 'o3',  score: 2 }, { questionId: 'o4',  score: 3 },
      { questionId: 'o5',  score: 2 }, { questionId: 'o6',  score: 3 },
      { questionId: 'o7',  score: 2 }, { questionId: 'o8',  score: 3 },
      { questionId: 'o9',  score: 3 }, { questionId: 'o10', score: 2 },
      { questionId: 'o11', score: 2 }, { questionId: 'o12', score: 3 },
    ],
  },
  {
    id: 'a2',
    orgName: 'TechFlow Inc',
    assessor: 'Mark Johnson',
    createdAt: '2026-02-10T14:30:00Z',
    responses: [
      // Team
      { questionId: 't1',  score: 5 }, { questionId: 't2',  score: 5 },
      { questionId: 't3',  score: 4 }, { questionId: 't4',  score: 4 },
      { questionId: 't5',  score: 5 }, { questionId: 't6',  score: 5 },
      { questionId: 't7',  score: 5 }, { questionId: 't8',  score: 4 },
      { questionId: 't9',  score: 4 }, { questionId: 't10', score: 5 },
      { questionId: 't11', score: 4 }, { questionId: 't12', score: 4 },
      // ART
      { questionId: 'a1',  score: 5 }, { questionId: 'a2',  score: 4 },
      { questionId: 'a3',  score: 4 }, { questionId: 'a4',  score: 4 },
      { questionId: 'a5',  score: 4 }, { questionId: 'a6',  score: 4 },
      { questionId: 'a7',  score: 4 }, { questionId: 'a8',  score: 5 },
      { questionId: 'a9',  score: 4 }, { questionId: 'a10', score: 4 },
      { questionId: 'a11', score: 4 }, { questionId: 'a12', score: 3 },
      // Program
      { questionId: 'p1',  score: 5 }, { questionId: 'p2',  score: 4 },
      { questionId: 'p3',  score: 5 }, { questionId: 'p4',  score: 4 },
      { questionId: 'p5',  score: 4 }, { questionId: 'p6',  score: 3 },
      { questionId: 'p7',  score: 4 }, { questionId: 'p8',  score: 4 },
      { questionId: 'p9',  score: 4 }, { questionId: 'p10', score: 3 },
      { questionId: 'p11', score: 4 }, { questionId: 'p12', score: 4 },
      // Portfolio
      { questionId: 'pf1',  score: 4 }, { questionId: 'pf2',  score: 3 },
      { questionId: 'pf3',  score: 3 }, { questionId: 'pf4',  score: 3 },
      { questionId: 'pf5',  score: 4 }, { questionId: 'pf6',  score: 3 },
      { questionId: 'pf7',  score: 3 }, { questionId: 'pf8',  score: 3 },
      { questionId: 'pf9',  score: 3 }, { questionId: 'pf10', score: 3 },
      { questionId: 'pf11', score: 3 }, { questionId: 'pf12', score: 3 },
      // Organizational
      { questionId: 'o1',  score: 4 }, { questionId: 'o2',  score: 4 },
      { questionId: 'o3',  score: 3 }, { questionId: 'o4',  score: 4 },
      { questionId: 'o5',  score: 4 }, { questionId: 'o6',  score: 4 },
      { questionId: 'o7',  score: 3 }, { questionId: 'o8',  score: 4 },
      { questionId: 'o9',  score: 4 }, { questionId: 'o10', score: 3 },
      { questionId: 'o11', score: 3 }, { questionId: 'o12', score: 4 },
    ],
  },
]

export const mockProblems: ProblemEntry[] = [
  {
    id: 'pr1',
    assessmentId: 'a1',
    category: 'ART',
    gapDescription: 'PI Planning not running on regular cadence — teams misaligned on dependencies.',
    owner: 'Jane Smith',
    targetDate: '2026-03-31',
    status: 'In Progress',
  },
  {
    id: 'pr2',
    assessmentId: 'a1',
    category: 'Portfolio',
    gapDescription: 'No lean budgeting model in place — all funding still project-based.',
    owner: 'Finance Team',
    targetDate: '2026-06-30',
    status: 'Open',
  },
  {
    id: 'pr3',
    assessmentId: 'a1',
    category: 'Organizational',
    gapDescription: 'HR performance review process does not reflect Agile values.',
    owner: 'HR Director',
    targetDate: '2026-04-15',
    status: 'Open',
  },
]
