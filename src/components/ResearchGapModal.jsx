import { useState } from 'react'
import { findResearchGaps } from '../lib/ai'

export default function ResearchGapModal({ papers, onClose }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    try {
      const gaps = await findResearchGaps(papers)
      setResult(gaps)
    } catch (err) {
      if (err.message === 'No papers to analyze') {
        setError('Add some papers to your shelf first before analyzing gaps.')
      } else {
        setError('Failed to analyze. Please try again.')
      }
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
         onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
           onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <div>
              <h2 className="text-lg font-semibold">Research Gap Finder</h2>
              <p className="text-xs text-gray-500">Analyzing {papers.length} papers in your shelf</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Analyze button */}
        {!result && (
          <>
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-400 leading-relaxed">
                Claude AI will analyze all {papers.length} papers in your shelf and identify:
              </p>
              <ul className="mt-2 space-y-1">
                {['Themes you have covered', 'Gaps in your reading', '3 papers you should read next', 'Overall assessment of your research breadth'].map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="text-purple-400">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || papers.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing your research shelf...
                </>
              ) : (
                <>🔍 Analyze Research Gaps</>
              )}
            </button>
          </>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Assessment */}
            <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                📊 Overall Assessment
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed">{result.assessment}</p>
            </div>

            {/* Covered Themes */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">
                ✅ Themes You've Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.coveredThemes.map((theme, i) => (
                  <span key={i} className="text-xs bg-green-900/40 border border-green-700 text-green-300 px-2.5 py-1 rounded-full">
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Gaps */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3">
                ⚠️ Research Gaps
              </h3>
              <div className="space-y-3">
                {result.gaps.map((g, i) => (
                  <div key={i} className="border-l-2 border-orange-600 pl-3">
                    <p className="text-sm font-medium text-gray-200">{g.gap}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{g.why}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
                📚 Recommended Papers to Read Next
              </h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="bg-gray-900 rounded-lg p-3">
                    <p className="text-sm font-semibold text-white mb-1">
                      {i + 1}. {rec.title}
                    </p>
                    <p className="text-xs text-gray-400">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Regenerate */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full text-sm text-purple-400 hover:text-purple-300 border border-purple-800 hover:border-purple-600 py-2 rounded-lg transition"
            >
              ↺ Re-analyze
            </button>
          </div>
        )}

        <p className="text-center text-gray-600 text-xs mt-4">
          Powered by Claude AI (Anthropic)
        </p>
      </div>
    </div>
  )
}