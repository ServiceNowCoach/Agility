import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '@/contexts/DataContext'
import type { Category, ProblemEntry, ProblemStatus } from '@/types'
import { CATEGORIES } from '@/utils/scoring'

const STATUS_COLORS: Record<ProblemStatus, string> = {
  Open:          'bg-red-100 text-red-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Resolved:      'bg-green-100 text-green-700',
}

function emptyForm(assessmentId: string): Omit<ProblemEntry, 'id'> {
  return { assessmentId, category: 'Team', gapDescription: '', owner: '', targetDate: '', status: 'Open' }
}

export default function ProblemRegister() {
  const { id } = useParams<{ id: string }>()
  const { assessments, problems: allProblems, addProblem, updateProblem, deleteProblem } = useData()

  const assessment = assessments.find((a) => a.id === id)
  // Derive problems for this assessment from context (no local copy needed)
  const problems = allProblems.filter((p) => p.assessmentId === id)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<ProblemEntry, 'id'>>(emptyForm(id ?? ''))
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  if (!assessment) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        <p className="text-slate-500">Assessment not found.</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">← Back</Link>
      </div>
    )
  }

  async function handleSave() {
    if (!form.gapDescription.trim()) return
    setSaving(true)
    try {
      if (editId) {
        await updateProblem({ ...form, id: editId })
        setEditId(null)
      } else {
        await addProblem(form)
      }
      setForm(emptyForm(id ?? ''))
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(entry: ProblemEntry) {
    setForm({ ...entry })
    setEditId(entry.id)
    setShowForm(true)
  }

  async function handleDelete(entryId: string) {
    await deleteProblem(entryId)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-indigo-600">Dashboard</Link>
        <span>/</span>
        <Link to={`/assessment/${id}`} className="hover:text-indigo-600">
          {assessment.orgName}
        </Link>
        <span>/</span>
        <span className="text-slate-800">Problem Register</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Problem Register</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track and remediate identified gaps for {assessment.orgName}.
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm(id ?? '')); setEditId(null); setShowForm(true) }}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          + Add Gap
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-indigo-900 mb-4">
            {editId ? 'Edit Gap' : 'New Gap'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Gap Description</label>
              <textarea
                value={form.gapDescription}
                onChange={(e) => setForm({ ...form, gapDescription: e.target.value })}
                rows={2}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Describe the identified gap…"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Owner</label>
              <input
                type="text"
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g., Jane Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Date</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ProblemStatus })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {(['Open', 'In Progress', 'Resolved'] as ProblemStatus[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Gap'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null) }}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Problems table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Gap Description', 'Category', 'Owner', 'Target Date', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {problems.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 text-slate-800 max-w-xs">{p.gapDescription}</td>
                <td className="px-5 py-4 text-slate-600">{p.category}</td>
                <td className="px-5 py-4 text-slate-600">{p.owner || '—'}</td>
                <td className="px-5 py-4 text-slate-500">
                  {p.targetDate ? new Date(p.targetDate).toLocaleDateString() : '—'}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs text-slate-500 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {problems.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>No gaps recorded yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-indigo-600 hover:underline text-sm"
            >
              Add the first gap →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
