import type { Category, CategoryScore, MaturityLevel, Question, Response } from '@/types'

export const CATEGORIES: Category[] = ['Team', 'ART', 'Program', 'Portfolio', 'Organizational']

export function getMaturityLabel(percent: number): MaturityLevel {
  if (percent < 20) return 'Initial'
  if (percent < 40) return 'Developing'
  if (percent < 60) return 'Defined'
  if (percent < 80) return 'Managed'
  return 'Optimizing'
}

export function getMaturityColor(label: MaturityLevel): string {
  const colors: Record<MaturityLevel, string> = {
    Initial:    'bg-red-100 text-red-700',
    Developing: 'bg-orange-100 text-orange-700',
    Defined:    'bg-yellow-100 text-yellow-700',
    Managed:    'bg-blue-100 text-blue-700',
    Optimizing: 'bg-green-100 text-green-700',
  }
  return colors[label]
}

export function calcCategoryScores(
  responses: Response[],
  questions: Question[]
): CategoryScore[] {
  return CATEGORIES.map((category) => {
    const categoryQuestions = questions.filter((q) => q.category === category)
    const maxPossible = categoryQuestions.reduce(
      (sum, q) => sum + q.maxScore * q.weight,
      0
    )
    const weightedScore = categoryQuestions.reduce((sum, q) => {
      const resp = responses.find((r) => r.questionId === q.id)
      const score = resp?.score ?? 0
      return sum + score * q.weight
    }, 0)
    const percent = maxPossible > 0 ? (weightedScore / maxPossible) * 100 : 0
    return {
      category,
      percent: Math.round(percent * 10) / 10,
      label: getMaturityLabel(percent),
      weightedScore,
      maxPossible,
    }
  })
}

export function calcOverallPercent(categoryScores: CategoryScore[]): number {
  const totalWeighted = categoryScores.reduce((s, c) => s + c.weightedScore, 0)
  const totalMax = categoryScores.reduce((s, c) => s + c.maxPossible, 0)
  if (totalMax === 0) return 0
  return Math.round((totalWeighted / totalMax) * 1000) / 10
}
