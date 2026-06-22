import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import AddPaperModal from '../components/AddPaperModal'
import EditPaperModal from '../components/EditPaperModal'
import PaperCard from '../components/PaperCard'

const STATUS_FILTERS = ['all', 'unread', 'reading', 'done']

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [papers, setPapers] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editPaper, setEditPaper] = useState(null)

  const fetchPapers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setPapers(data || [])
    setLoading(false)
  }, [user.id])

  useEffect(() => { fetchPapers() }, [fetchPapers])

  const handleDelete = async (id) => {
    if (!confirm('Delete this paper?')) return
    const { error } = await supabase.from('papers').delete().eq('id', id)
    if (!error) setPapers(prev => prev.filter(p => p.id !== id))
  }

  const filtered = filter === 'all' ? papers : papers.filter(p => p.status === filter)

  const counts = {
    all: papers.length,
    unread: papers.filter(p => p.status === 'unread').length,
    reading: papers.filter(p => p.status === 'reading').length,
    done: papers.filter(p => p.status === 'done').length,
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold">PaperShelf</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
            <button
              onClick={signOut}
              className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Papers</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <span>+</span> Add Paper
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f} <span className="ml-1 opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Papers list */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading your papers...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-gray-400">
              {filter === 'all'
                ? "No papers yet. Add your first one!"
                : `No papers with status "${filter}".`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowAdd(true)}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
              >
                + Add your first paper
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(paper => (
              <PaperCard
                key={paper.id}
                paper={paper}
                onEdit={() => setEditPaper(paper)}
                onDelete={() => handleDelete(paper.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showAdd && (
        <AddPaperModal
          userId={user.id}
          onClose={() => setShowAdd(false)}
          onAdded={(paper) => {
            setPapers(prev => [paper, ...prev])
            setShowAdd(false)
          }}
        />
      )}

      {editPaper && (
        <EditPaperModal
          paper={editPaper}
          onClose={() => setEditPaper(null)}
          onUpdated={(updated) => {
            setPapers(prev => prev.map(p => p.id === updated.id ? updated : p))
            setEditPaper(null)
          }}
        />
      )}
    </div>
  )
}
