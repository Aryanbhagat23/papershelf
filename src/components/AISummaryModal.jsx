import { useState } from 'react'
import { summarizePaper } from '../lib/ai'

export default function AISummaryModal({ paper, onClose }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSummarize = async () => {
    setLoading(true)
    setError('')
    try {
      const summary = await summarizePaper(paper)
      setResult(summary)
    } catch (err) {
      setError('Failed to generate summary. Check your API key.')
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
         onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h2 className="text-lg font-semibold">AI Summary</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-400 mb-1">Summarizing:</p>
          <p className="text-white font-medium text-sm leading-snug">{paper.title}</p>
          {paper.authors && <p className="text-gray-400 text-xs mt-1">{paper.authors}</p>}
        </div>
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        {!result && (
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating with Claude AI...
              </>
            ) : (
              <>✨ Generate AI Summary</>
            )}
          </button>
        )}
        {result && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">📄 Summary</h3>
              <p className="text-gray-200 text-sm leading-relaxed">{result.summary}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">🔑 Key Topics</h3>
              <div className="flex flex-wrap gap-2">
                {result.keyTopics.map((topic, i) => (
                  <span key={i} className="text-xs bg-blue-900/40 border border-blue-700 text-blue-300 px-2.5 py-1 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">💡 Why It Matters</h3>
              <p className="text-gray-200 text-sm leading-relaxed">{result.importance}</p>
            </div>
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="w-full text-sm text-purple-400 hover:text-purple-300 border border-purple-800 hover:border-purple-600 py-2 rounded-lg transition"
            >
              ↺ Regenerate
            </button>
          </div>
        )}
        <p className="text-center text-gray-600 text-xs mt-4">Powered by Claude AI (Anthropic)</p>
      </div>
    </div>
  )
}