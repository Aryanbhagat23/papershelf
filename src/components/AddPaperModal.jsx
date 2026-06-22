import { useState } from 'react'
import { supabase } from '../lib/supabase'

const INITIAL = {
  title: '', authors: '', year: '', doi: '',
  tags: '', status: 'unread', notes: '', rating: ''
}

export default function AddPaperModal({ userId, onClose, onAdded }) {
  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setError(''); setLoading(true)

    const payload = {
      user_id: userId,
      title: form.title.trim(),
      authors: form.authors.trim() || null,
      year: form.year ? parseInt(form.year) : null,
      doi: form.doi.trim() || null,
      tags: form.tags.trim() || null,
      status: form.status,
      notes: form.notes.trim() || null,
      rating: form.rating ? parseInt(form.rating) : null,
    }

    const { data, error } = await supabase.from('papers').insert(payload).select().single()
    if (error) { setError(error.message) }
    else { onAdded(data) }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add Paper</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input value={form.title} onChange={set('title')} required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Paper title" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Authors</label>
            <input value={form.authors} onChange={set('authors')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Author 1, Author 2, ..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Year</label>
              <input type="number" value={form.year} onChange={set('year')} min="1900" max="2099"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="2024" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select value={form.status} onChange={set('status')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                <option value="unread">Unread</option>
                <option value="reading">Reading</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">DOI or URL</label>
            <input value={form.doi} onChange={set('doi')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="10.1234/... or https://arxiv.org/abs/..." />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Tags</label>
            <input value={form.tags} onChange={set('tags')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="deep learning, CV, medical AI" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Rating (1–5)</label>
            <select value={form.rating} onChange={set('rating')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
              <option value="">No rating</option>
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea value={form.notes} onChange={set('notes')} rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Your thoughts on this paper..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 rounded-lg transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition">
              {loading ? 'Adding...' : 'Add Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
