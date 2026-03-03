import { useParams, Link } from 'react-router-dom'
import { useData } from '@/contexts/DataContext'
import { questions } from '@/data/questions'
import { calcCategoryScores, calcOverallPercent, getMaturityLabel } from '@/utils/scoring'
import RadarChart from '@/components/RadarChart'
import ScoreCard from '@/components/ScoreCard'
import MaturityBadge from '@/components/MaturityBadge'

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>()
  const { assessments } = useData()
  const assessment = assessments.find((a) => a.id === id)

  if (!assessment) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        <p className="text-slate-500">Assessment not found.</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  const categoryScores = calcCategoryScores(assessment.responses, questions)
  const overallPercent = calcOverallPercent(categoryScores)
  const overallLabel = getMaturityLabel(overallPercent)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 no-print">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-slate-800">{assessment.orgName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{assessment.orgName}</h1>
          <p className="text-slate-500 text-sm mt-1">
            Assessed by {assessment.assessor} ·{' '}
            {new Date(assessment.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Export PDF
          </button>
          <Link
            to={`/assessment/${id}/problems`}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Problem Register →
          </Link>
        </div>
      </div>

      {/* Overall score banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white mb-8 flex items-center justify-between">
        <div>
          <p className="text-indigo-200 text-sm uppercase tracking-wide">Overall Maturity</p>
          <p className="text-5xl font-bold mt-1">{overallPercent}%</p>
        </div>
        <div className="text-right">
          <p className="text-indigo-200 text-sm mb-2">PageJones Level</p>
          <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-lg font-semibold">
            {overallLabel}
          </span>
        </div>
      </div>

      {/* Radar + Score cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Maturity Radar
          </h2>
          <RadarChart scores={categoryScores} label={assessment.orgName} />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            By Category
          </h2>
          {categoryScores.map((score) => (
            <ScoreCard key={score.category} score={score} />
          ))}
        </div>
      </div>

      {/* Maturity legend */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
          PageJones Maturity Scale
        </h2>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { label: 'Initial',    range: '0–19%',  desc: 'Ad-hoc, reactive practices' },
              { label: 'Developing', range: '20–39%', desc: 'Some practices adopted' },
              { label: 'Defined',    range: '40–59%', desc: 'Consistent, documented processes' },
              { label: 'Managed',    range: '60–79%', desc: 'Measured and controlled' },
              { label: 'Optimizing', range: '80–100%',desc: 'Continuously improving' },
            ] as const
          ).map(({ label, range, desc }) => (
            <div
              key={label}
              className={`flex-1 min-w-32 rounded-lg p-3 border ${
                overallLabel === label ? 'ring-2 ring-indigo-400' : ''
              } border-slate-100`}
            >
              <MaturityBadge label={label} size="sm" />
              <p className="text-xs text-slate-500 mt-1">{range}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
