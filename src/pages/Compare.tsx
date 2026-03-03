import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { useData } from '@/contexts/DataContext'
import { questions } from '@/data/questions'
import { calcCategoryScores, calcOverallPercent, getMaturityLabel, CATEGORIES } from '@/utils/scoring'
import MaturityBadge from '@/components/MaturityBadge'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// Colour palette for datasets (up to 5 orgs)
const PALETTE = [
  { border: 'rgba(99, 102, 241, 0.9)',  bg: 'rgba(99, 102, 241, 0.12)'  },
  { border: 'rgba(16, 185, 129, 0.9)',  bg: 'rgba(16, 185, 129, 0.12)'  },
  { border: 'rgba(245, 158, 11, 0.9)',  bg: 'rgba(245, 158, 11, 0.12)'  },
  { border: 'rgba(239, 68, 68, 0.9)',   bg: 'rgba(239, 68, 68, 0.12)'   },
  { border: 'rgba(139, 92, 246, 0.9)',  bg: 'rgba(139, 92, 246, 0.12)'  },
]

export default function Compare() {
  const { assessments } = useData()
  const [selected, setSelected] = useState<string[]>(
    assessments.slice(0, 2).map((a) => a.id)
  )

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev
    )
  }

  const enriched = assessments.map((a) => {
    const categoryScores = calcCategoryScores(a.responses, questions)
    const overallPercent = calcOverallPercent(categoryScores)
    return { ...a, categoryScores, overallPercent, overallLabel: getMaturityLabel(overallPercent) }
  })

  const chosen = selected
    .map((id) => enriched.find((a) => a.id === id))
    .filter(Boolean) as typeof enriched

  const radarData = {
    labels: CATEGORIES,
    datasets: chosen.map((a, i) => ({
      label: a.orgName,
      data: CATEGORIES.map(
        (cat) => a.categoryScores.find((s) => s.category === cat)?.percent ?? 0
      ),
      backgroundColor: PALETTE[i % PALETTE.length].bg,
      borderColor: PALETTE[i % PALETTE.length].border,
      borderWidth: 2,
      pointBackgroundColor: PALETTE[i % PALETTE.length].border,
      pointBorderColor: '#fff',
      pointRadius: 4,
    })),
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          font: { size: 10 },
          color: '#94a3b8',
          backdropColor: 'transparent',
        },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.3)' },
        pointLabels: {
          font: { size: 12, weight: 'bold' as const },
          color: '#475569',
        },
      },
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 12 } } },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; formattedValue: string }) =>
            ` ${ctx.dataset.label ?? ''}: ${ctx.formattedValue}%`,
        },
      },
    },
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-slate-800">Compare</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Compare Assessments</h1>
        <p className="text-slate-500 text-sm mt-1">Select up to 5 assessments to compare side-by-side.</p>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-8">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Select assessments ({selected.length} / 5)
        </p>
        <div className="flex flex-wrap gap-2">
          {enriched.map((a) => {
            const isActive = selected.includes(a.id)
            return (
              <button
                key={a.id}
                onClick={() => toggle(a.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  isActive
                    ? 'border-transparent text-white'
                    : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
                style={
                  isActive
                    ? { backgroundColor: PALETTE[selected.indexOf(a.id) % PALETTE.length].border }
                    : {}
                }
              >
                {a.orgName}
              </button>
            )
          })}
        </div>
      </div>

      {chosen.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p>Select at least one assessment above to compare.</p>
        </div>
      )}

      {chosen.length >= 1 && (
        <>
          {/* Radar chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
              Maturity Radar
            </h2>
            <div className="max-w-lg mx-auto">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Overall scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {chosen.map((a, i) => (
              <div
                key={a.id}
                className="bg-white rounded-xl border shadow-sm p-5"
                style={{ borderColor: PALETTE[i % PALETTE.length].border }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-900">{a.orgName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <MaturityBadge label={a.overallLabel} size="sm" />
                </div>
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: PALETTE[i % PALETTE.length].border }}
                >
                  {a.overallPercent}%
                </p>
                <p className="text-xs text-slate-400">Overall maturity</p>
              </div>
            ))}
          </div>

          {/* Category breakdown table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Category Breakdown
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Category
                    </th>
                    {chosen.map((a, i) => (
                      <th
                        key={a.id}
                        className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: PALETTE[i % PALETTE.length].border }}
                      >
                        {a.orgName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CATEGORIES.map((cat) => (
                    <tr key={cat} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-700">{cat}</td>
                      {chosen.map((a, i) => {
                        const score = a.categoryScores.find((s) => s.category === cat)
                        return (
                          <td key={a.id} className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${score?.percent ?? 0}%`,
                                    backgroundColor: PALETTE[i % PALETTE.length].border,
                                  }}
                                />
                              </div>
                              <span className="text-slate-700 font-medium">
                                {score?.percent ?? 0}%
                              </span>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
