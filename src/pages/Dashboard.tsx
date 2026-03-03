import { Link } from 'react-router-dom'
import { useData } from '@/contexts/DataContext'
import { questions } from '@/data/questions'
import { calcCategoryScores, calcOverallPercent, getMaturityLabel } from '@/utils/scoring'
import MaturityBadge from '@/components/MaturityBadge'

export default function Dashboard() {
  const { assessments: rawAssessments, loading } = useData()

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-center text-slate-400 text-sm">
        Loading assessments…
      </div>
    )
  }

  const assessments = rawAssessments.map((a) => {
    const categoryScores = calcCategoryScores(a.responses, questions)
    const overallPercent = calcOverallPercent(categoryScores)
    return { ...a, overallPercent, overallLabel: getMaturityLabel(overallPercent) }
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assessments</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage agility maturity across organizations.
          </p>
        </div>
        <div className="flex gap-2">
          {assessments.length >= 2 && (
            <Link
              to="/compare"
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Compare
            </Link>
          )}
          <Link
            to="/assessment/new"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            + New Assessment
          </Link>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Assessments', value: assessments.length },
          {
            label: 'Avg Overall Score',
            value:
              Math.round(
                assessments.reduce((s, a) => s + a.overallPercent, 0) / assessments.length
              ) + '%',
          },
          {
            label: 'Latest Assessment',
            value: new Date(
              Math.max(...assessments.map((a) => new Date(a.createdAt).getTime()))
            ).toLocaleDateString(),
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Assessments table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Organization', 'Assessor', 'Date', 'Overall Score', 'Maturity', ''].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assessments.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-medium text-slate-900">{a.orgName}</td>
                <td className="px-5 py-4 text-slate-600">{a.assessor}</td>
                <td className="px-5 py-4 text-slate-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-20">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${a.overallPercent}%` }}
                      />
                    </div>
                    <span className="text-slate-700 font-medium">{a.overallPercent}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <MaturityBadge label={a.overallLabel} size="sm" />
                </td>
                <td className="px-5 py-4">
                  <Link
                    to={`/assessment/${a.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {assessments.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg">No assessments yet.</p>
            <Link
              to="/assessment/new"
              className="mt-3 inline-block text-indigo-600 hover:underline text-sm"
            >
              Start your first assessment →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
