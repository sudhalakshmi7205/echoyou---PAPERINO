'use client'
import { useState } from 'react'
import { runATSAnalysis } from '../actions'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function ATSAnalyzerClient({ resumeId }: { resumeId: string }) {
  const [targetRole, setTargetRole] = useState('')
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!targetRole || !jd) {
      setError("Please fill out both the target role and job description.")
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await runATSAnalysis(resumeId, targetRole, jd)
      setResult(res)
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume.")
    } finally {
      setLoading(false)
    }
  }

  const CircleProgress = ({ score, label, color }: { score: number, label: string, color: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={color}
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute text-xl font-bold text-gray-800">{score}%</div>
      </div>
      <div className="mt-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</div>
    </div>
  )

  return (
    <div className="space-y-8">
      {!result ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
            <input 
              type="text" 
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea 
              rows={8}
              placeholder="Paste the full job description here..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={jd}
              onChange={e => setJd(e.target.value)}
            />
          </div>
          
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Analyzing against ATS Algorithms..." : "Run ATS Analysis"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Scores Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex justify-around">
            <CircleProgress score={result.matchScore} label="Overall Match" color="text-indigo-600" />
            <CircleProgress score={result.formatScore} label="Format & Structure" color="text-teal-500" />
            <CircleProgress score={result.keywordScore} label="Keyword Density" color="text-purple-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Keywords */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" /> Critical Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.length > 0 ? result.missingKeywords.map((kw: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm font-medium">
                    {kw}
                  </span>
                )) : (
                  <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Great job, no critical keywords missing!
                  </span>
                )}
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> What You Did Right
              </h3>
              <ul className="space-y-2">
                {result.feedback.strengths.map((str: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">•</span> {str}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-indigo-500">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actionable Feedback for Formatting</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">Major Weaknesses Found:</h4>
                <ul className="space-y-2">
                  {result.feedback.weaknesses.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-red-500 mt-0.5">⚠️</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Steps to Improve Score:</h4>
                <ul className="space-y-2">
                  {result.feedback.actionableSteps.map((step: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-indigo-500 mt-0.5">→</span> {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setResult(null)}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Analyze Another Job Description
          </button>
        </div>
      )}
    </div>
  )
}
