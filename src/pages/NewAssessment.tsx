import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions } from '@/data/questions'
import { useData } from '@/contexts/DataContext'
import { calcCategoryScores, calcOverallPercent, CATEGORIES } from '@/utils/scoring'
import type { Category, Response } from '@/types'

const STEPS: (Category | 'info')[] = ['info', ...CATEGORIES]

const STEP_LABELS: Record<string, string> = {
  info:           'Details',
  Team:           'Team',
  ART:            'ART',
  Program:        'Program',
  Portfolio:      'Portfolio',
  Organizational: 'Organizational',
}

const SCORE_LABELS: Record<number, string> = {
  1: 'None / Not started',
  2: 'Minimal',
  3: 'Partial',
  4: 'Mostly done',
  5: 'Fully optimized',
}

export default function NewAssessment() {
  const navigate = useNavigate()
  const { addAssessment } = useData()
  const [step, setStep] = useState(0)
  const [orgName, setOrgName] = useState('')
  const [assessor, setAssessor] = useState('')
  const [responses, setResponses] = useState<Record<string, number>>({})

  const currentStep = STEPS[step]
  const isInfoStep = currentStep === 'info'
  const categoryQuestions = isInfoStep
    ? []
    : questions.filter((q) => q.category === currentStep)

  const allResponses: Response[] = Object.entries(responses).map(([questionId, score]) => ({
    questionId,
    score,
  }))
  const categoryScores = calcCategoryScores(allResponses, questions)
  const overallPercent = calcOverallPercent(categoryScores)

  const isStepComplete = isInfoStep
    ? orgName.trim() !== '' && assessor.trim() !== ''
    : categoryQuestions.every((q) => responses[q.id] !== undefined)

  function handleScore(questionId: string, score: number) {
    setResponses((prev) => ({ ...prev, [questionId]: score }))
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setSubmitting(true)
      setSubmitError(null)
      try {
        const newId = await addAssessment(orgName, assessor, allResponses)
        navigate(`/assessment/${newId}`)
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Failed to save assessment.')
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Step progress */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                i < step
                  ? 'bg-indigo-600 text-white cursor-pointer'
                  : i === step
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                  : 'bg-slate-100 text-slate-400 cursor-default'
              }`}
            >
              {i + 1}
            </button>
            <span
              className={`text-xs hidden sm:block ${
                i === step ? 'text-slate-800 font-medium' : 'text-slate-400'
              }`}
            >
              {STEP_LABELS[s]}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-4 mx-1 ${i < step ? 'bg-indigo-400' : 'bg-slate-200'}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Real-time score preview (after info step) */}
      {!isInfoStep && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
          <span className="text-sm text-indigo-700 font-medium">Overall score so far</span>
          <span className="text-2xl font-bold text-indigo-700">{overallPercent}%</span>
        </div>
      )}

      {/* Step content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {isInfoStep ? (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Assessment Details</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g., Acme Corp"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assessor Name
              </label>
              <input
                type="text"
                value={assessor}
                onChange={(e) => setAssessor(e.target.value)}
                placeholder="e.g., Jane Smith"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              {currentStep} Level
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Rate each practice from 1 (not started) to 5 (fully optimized).
            </p>
            <div className="space-y-6">
              {categoryQuestions.map((q, idx) => (
                <div key={q.id}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="mt-0.5 text-xs font-semibold text-slate-400 w-4 shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-800">{q.text}</p>
                    <span className="shrink-0 text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      ×{q.weight}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-7">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleScore(q.id, val)}
                        title={SCORE_LABELS[val]}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all ${
                          responses[q.id] === val
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                    {responses[q.id] && (
                      <span className="self-center text-xs text-slate-400 ml-1">
                        {SCORE_LABELS[responses[q.id]]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isStepComplete || submitting}
          className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Saving…' : step === STEPS.length - 1 ? 'Submit Assessment' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
