const STATUS_COLORS = {
  unread: 'bg-gray-700 text-gray-300',
  reading: 'bg-blue-900/50 text-blue-300 border border-blue-700',
  done: 'bg-green-900/50 text-green-300 border border-green-700',
}

const STATUS_LABELS = {
  unread: '○ Unread',
  reading: '◐ Reading',
  done: '● Done',
}

function Stars({ rating }) {
  if (!rating) return <span className="text-gray-600 text-sm">No rating</span>
  return (
    <span className="text-yellow-400 text-sm">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function PaperCard({ paper, onEdit, onDelete }) {
  const tags = paper.tags ? paper.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title + year */}
          <div className="flex items-start gap-3 mb-1">
            <h3 className="font-semibold text-white leading-snug">{paper.title}</h3>
            {paper.year && (
              <span className="text-gray-500 text-sm shrink-0 mt-0.5">({paper.year})</span>
            )}
          </div>

          {/* Authors */}
          {paper.authors && (
            <p className="text-gray-400 text-sm mb-2">{paper.authors}</p>
          )}

          {/* DOI */}
          {paper.doi && (
            <a
              href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`}
              target="_blank" rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs mb-2 inline-block"
            >
              {paper.doi}
            </a>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {paper.notes && (
            <p className="text-gray-500 text-sm italic border-l-2 border-gray-700 pl-3 mt-2">
              {paper.notes}
            </p>
          )}

          {/* Rating */}
          <div className="mt-3">
            <Stars rating={paper.rating} />
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[paper.status]}`}>
            {STATUS_LABELS[paper.status]}
          </span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={onEdit}
              className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded bg-blue-900/20 hover:bg-blue-900/40 transition"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-900/20 hover:bg-red-900/40 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
