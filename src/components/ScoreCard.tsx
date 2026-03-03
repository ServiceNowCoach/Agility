import type { CategoryScore } from '@/types'
import MaturityBadge from './MaturityBadge'

interface Props {
  score: CategoryScore
}

const CATEGORY_ICONS: Record<string, string> = {
  Team:           '👥',
  ART:            '🚂',
  Program:        '📋',
  Portfolio:      '💼',
  Organizational: '🏢',
}

export default function ScoreCard({ score }: Props) {
  const icon = CATEGORY_ICONS[score.category] ?? '📊'

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-slate-800 text-sm">{score.category}</span>
        </div>
        <MaturityBadge label={score.label} size="sm" />
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Score</span>
          <span>{score.percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${score.percent}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-slate-400">
        {score.weightedScore} / {score.maxPossible} weighted points
      </p>
    </div>
  )
}
